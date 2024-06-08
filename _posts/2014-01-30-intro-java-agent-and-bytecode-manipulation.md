---
title: "An introduction to Java Agent and bytecode manipulation"
slug: intro-java-agent-and-bytecode-manipulation
lang: en
---

A few months ago, I wrote a little shell script to colorize Maven's output
(see [this post](http://tomsquest.com/blog/2013/09/maven-in-colors)).
This is a good solution, but [Jean-Christophe Gay](https://twitter.com/jchristophegay) has written a pure Java version
to solve the same problem with interesting bits of Java technologies.

In this post, we will see how a Java Agent and some bytecode manipulation can open the inner guts of code we don't own.

## Code sample

I wrote a little test project to wire the stuff involved.
There are two Maven module, one for the Agent and one for representing the external lib (we should not modify it).
The whole code is here : https://github.com/tomsquest/java-agent-asm-javassist-sample

### Agent

First, we need a Java Agent to inject and intercept real code.
The agent framework is part of the JDK and allow us to operate on classes before (and even after) they are used.

Here is the code of the Agent. Note the premain static method which is called at start.

```java
public class Agent {
    public static void premain(String agentArgs, Instrumentation inst) {
        inst.addTransformer(new Transformer() {
            @Override
            public byte[] transform(ClassLoader classLoader, String s, Class<?> aClass, ProtectionDomain protectionDomain, byte[] bytes) throws IllegalClassFormatException {

                // Intercept the call to the class Stuff
                if ("other/Stuff".equals(s)) {
                    // ASM Code
                    ClassReader reader = new ClassReader(bytes);
                    ClassWriter writer = new ClassWriter(reader, 0);
                    ClassPrinter visitor = new ClassPrinter(writer);
                    reader.accept(visitor, 0);
                    return writer.toByteArray();
                }

                return null;
            }
        }
    }
}
```

The agent is called because the JVM is launched with the -javaagent:myjar.jar parameter and because the Manifest indicates this class.

Command line :

```
$ java -javaagent:agent/target/agent-0.1-SNAPSHOT.jar -jar other/target/other-0.1-SNAPSHOT.jar
```

### ASM

In order to manipulate the bytecode, I used the ASM framework.
[ASM](http://asm.ow2.org) is a Java bytecode manipulation and analysis framework used in many products.

In the example above, the ClassPrinter prints the signatures of the classes and methods visited.

```java
public class ClassPrinter extends ClassVisitor {

    public ClassPrinter(ClassWriter writer) {
        super(Opcodes.ASM4, writer);
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        System.out.println(name + " extends " + superName + " {");
        super.visit(version, access, name, signature, superName, interfaces);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String desc, String signature, String[] exceptions) {
        System.out.println(" " + name + desc);
        return super.visitMethod(access, name, desc, signature, exceptions);
    }

    @Override
    public void visitEnd() {
        System.out.println("}");
        super.visitEnd();
    }
}
```

Here is the output, as we intercepted the call to the `Stuff` class :

```java
other/Stuff extends java/lang/Object {
 <init>()V
 run()V
}
I AM DOING SOME STUFF...
```

### Javassist

Javassist is another bytecode manipulation framework. I found it simpler due to higher level methods like addLocalVariable, insertBefore, insertAfter...

Here is a version of the Agent used to output the elapsed time for executing the `run` method :

```java
public class Agent {

    public static void premain(String agentArgs, Instrumentation inst) {
        inst.addTransformer(new ClassFileTransformer() {
            @Override
            public byte[] transform(ClassLoader classLoader, String s, Class<?> aClass, ProtectionDomain protectionDomain, byte[] bytes) throws IllegalClassFormatException {

                if ("other/Stuff".equals(s)) {
                    // Javassist
                    try {
                        ClassPool cp = ClassPool.getDefault();
                        CtClass cc = cp.get("other.Stuff");
                        CtMethod m = cc.getDeclaredMethod("run");
                        m.addLocalVariable("elapsedTime", CtClass.longType);
                        m.insertBefore("elapsedTime = System.currentTimeMillis();");
                        m.insertAfter("{elapsedTime = System.currentTimeMillis() - elapsedTime;"
                                + "System.out.println(\"Method Executed in ms: \" + elapsedTime);}");
                        byte[] byteCode = cc.toBytecode();
                        cc.detach();
                        return byteCode;
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                }

                return null;
            }
        });
    }
}
```

Output :

```
I AM DOING SOME STUFF...
Method Executed in ms: 1
```

## Real case : Maven colorization

[Jean-Christophe Gay](https://twitter.com/jchristophegay) hacked Maven to colorize the output and to highlight warnings and errors.
And it did that without altering Maven, but from the outside.
The idea is to start Maven with an agent which enhance Maven (3.0) output with colorization.

It is interesting as a real world scenario because Maven does not expose an API to access the log in real time, and also
because one needs to know exactly where to inject the custom code and how fragile it is to hack
a third-party piece of code.

You can see his code here : https://github.com/jcgay/maven-color

In its code, the author had to :

- start the agent when the target program is run, this was done using the MAVEN_OPTS environment variable
- find where Maven was outputting relevant logs message (well, this has to be done for Maven and Surefire, which is even
  more susceptible to change.

For example, this is how the new method for output colorization is created with pure bytecode injection, using ASM :

```java
private void createSetupAnsiColorLoggerMethod() {
    MethodVisitor mv = cv.visitMethod(Opcodes.ACC_PRIVATE, "setupLogger", "(Lorg/apache/maven/cli/MavenCli$CliRequest;)Lorg/codehaus/plexus/logging/Logger;", null, null);
    mv.visitCode();
    mv.visitTypeInsn(Opcodes.NEW, "com/github/jcgay/maven/color/logger/AnsiColorLogger");
    mv.visitInsn(Opcodes.DUP);
    mv.visitMethodInsn(Opcodes.INVOKESPECIAL, "com/github/jcgay/maven/color/logger/AnsiColorLogger", "<init>", "()V");
    mv.visitVarInsn(Opcodes.ASTORE, 2);
    mv.visitVarInsn(Opcodes.ALOAD, 2);
    mv.visitVarInsn(Opcodes.ALOAD, 1);
    mv.visitFieldInsn(Opcodes.GETFIELD, "org/apache/maven/cli/MavenCli$CliRequest", "request", "Lorg/apache/maven/execution/MavenExecutionRequest;");
    mv.visitMethodInsn(Opcodes.INVOKEINTERFACE, "org/apache/maven/execution/MavenExecutionRequest", "getLoggingLevel", "()I");
    mv.visitMethodInsn(Opcodes.INVOKEINTERFACE, "org/codehaus/plexus/logging/Logger", "setThreshold", "(I)V");
    mv.visitVarInsn(Opcodes.ALOAD, 2);
    mv.visitInsn(Opcodes.ARETURN);
    mv.visitMaxs(2, 3);
    mv.visitEnd();
}
```

Reading [Bytecode for Dummies](http://www.slideshare.net/CharlesNutter/javaone-2011-jvm-bytecode-for-dummies) will help, for sure.

For another real world usage, there is [Byteman](https://www.jboss.org/byteman) written by JBoss.
This tool simplifies testing of Java programs. The documentation is difficult to read, IMHO, but the presentation I
saw three years ago was really stunning. Byteman can be used to make untestable code testable.
