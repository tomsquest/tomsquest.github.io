---
title: "You need a MacroPad"
lang: en
image: /assets/images/posts/2024-09-28-you-need-a-macropad/macropad_with_keycaps.jpg
---

I found a pretty good companion for my Keyboard: a **MacroPad**! ⌨️  

These devices are surprisingly affordable and provide convenient access to custom functions.

A significant advantage: there's a Linux configuration tool available!

## TL;DR

- My usage: Discord controls (mute, deafen), media playback, and volume control
- A mere `13.57` euros  (11/11 2023 sale - your mileage may vary)
- Powered by the OpenSource [Macro Keyboard Configuration Utility](https://github.com/kriomant/ch57x-keyboard-tool) by [Mikhail Trishchenkov](https://github.com/kriomant)

## Buying

I selected a compact and straightforward model on Aliexpress.  
It features `6` keys and `1` rotary encoder.

Many sellers sell the same models, so pick the cheapest one you can find!

Here's what my order looked like:

![macropad_aliexpress_order.jpg](/assets/images/posts/2024-09-28-you-need-a-macropad/macropad_aliexpress_order.jpg)

## Software

The provided software is a joke. Like something developed by someone that knows nothing about UI and Software.

You will also find many versions of this software (I found three different on Reddit), each a bit different and limited.

And who wants to run that kind of software on your computer? (of course, no source code)  

⭐ The real trick is to use the [Macro Keyboard Configuration Utility](https://github.com/kriomant/ch57x-keyboard-tool) developed by [Mikhail Trishchenkov ](https://github.com/kriomant).

### Quick usage

1. Download the tool from the [Releases](https://github.com/kriomant/ch57x-keyboard-tool/tree/master)
2. Create a file based on the [`example-mapping.yaml`](https://github.com/kriomant/ch57x-keyboard-tool/blob/master/example-mapping.yaml)
3. Validate using: `./ch57x-keyboard-tool validate your-config.yaml`
4. Set the config: `sudo ./ch57x-keyboard-tool upload your-config.yaml`

## Mapping

My keybindings are:
- One row for Discord: toggle mute, toggle deafen, disconnect
- One row for Music: previous, play/pause, next
- The rotary encoder controls sound volume and toggles mute on push

The mapping I'm currently using is:

```yaml
orientation: normal
rows: 2
columns: 3
knobs: 1
layers:
  - buttons:
      - ["prev", "play", "next"]
      - ["rctrl-ralt-rshift-f22", "rctrl-ralt-rshift-f23", "rctrl-ralt-rshift-f24"]
    knobs:
      - ccw: 'volumedown'
        press: 'mute'
        cw: 'volumeup'
```

## About LEDs

The device features some RGB lightnings. But those are pretty useless.

For instance, you can't toggle it per key, and the colors aren't configurable. Only some effects are available.

So I don't use them.

## Photos

![macropad_with_keycaps.jpg](/assets/images/posts/2024-09-28-you-need-a-macropad/macropad_with_keycaps.jpg)
![macropad_without_keycaps.jpg](/assets/images/posts/2024-09-28-you-need-a-macropad/macropad_without_keycaps.jpg)
![macropad_vertical.jpg](/assets/images/posts/2024-09-28-you-need-a-macropad/macropad_vertical.jpg)
![macropad_with_keyboard.jpg](/assets/images/posts/2024-09-28-you-need-a-macropad/macropad_with_keyboard.jpg)
