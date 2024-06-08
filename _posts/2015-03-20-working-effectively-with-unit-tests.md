---
title: "Working Effectively with Unit Tests by Jay Fields"
lang: en
---

![Book cover](/assets/images/posts/wewut-cover.jpg)

I am very happy to have read Jay Fields' Working effectively with unit tests.
This is a rare book where developers are taught how to be better at a very-argued discipline: testing.

Jay Fields explains its opinions on how he tests, what he tests and how best he thinks
testing can be done. This is a rare event when somebody explains directly how and why
he write code like that. In my professional life, events like that are not so common,
especially when they are prepared and arguments well presented.

Here are some of my notes :

## Best practices

- Better to have N tests than a single test with a loop
- Inline setup is better that referencing a variable
- Test names are comments under cover, they will mislead
- Data builders is better than globally-defined object with default values (Object Mother)

## Readability

Each method added to a test complicates the tiny universe of the tests.
It is hard to know which abstraction will reduce the complexity and provide value.
Being DRY in tests does more harm than good, so repeating ourselves may be better for readability.

## ROI

"Productively Unit Testing" is evaluating the cost of writing and maintaining a test.
It is acceptable to delete a test after a TDD session or during a code review, if
the value of the test does not seem positive.

Test what seems fragile and is expected to change, ignore the rest.

## Test names

Test names are comments. They degrade with time, they may be wrong or worse they may mislead.

And, it is rare when a test name tells you what is going wrong. It will just indicate where to
first look at (the body of the test method). So test names are just pointer to code. **The shorter, the better.**

"Implementation over-specification" means a test is fragile because it knows too much about what
it is trying to verify, and that a small change in the production code will break the test.

Solutions are to relax prepartion with Mockito's anyString/anyLong/... ; Null as a return value is acceptable.

It is simpler and more readable to compare a literal (aka primitive) value, than objects together.

To avoid cascading failures, he only knows two solutions :

- make the tests more intelligent
- make the tests more ignorant.

## Coverage

He aims for 80% of coverage. Going for more that 80% is most likely that the motivation is a better greater number and not the ROI.

Don't forget that it's easy to fake a good coverage with tests without assertion...

## Broad Stack Test

These are End-to-End tests. They are complex and fragile.

He recommends that these tests will survive only if this is the author who maintains them and
not the whole team. And if the author leaves, the time will be best invested recreating those
tests than to try to fix them. I couldn't agree more.

His Mike Cohn Test pyramid is divided into: 1 to 12 Broad Stack Tests, 20% of "sociable" tests
(tests that interacts with others) and 80% unit tests.

## Paper edition

I read a paper edition, found on Amazon. The overall quality is quite good, but the lack of
emphasis/bold is disturbing on the code samples. Some lines are somewhat bold, but a
vertical line or some ninja-stylized thing could make the UX better.
This is one of the limit of using Markdown for publishing.

But this print edition is way better that the previous book I read ("Notes a software team leader" by Roy Osherove) where some markdown content was not parsed at all...

## Links

Author's blog: http://blog.jayfields.com/

The book: http://signup.wewut.com/
