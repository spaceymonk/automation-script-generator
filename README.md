# Automation Script Generator

Single Page Application to generate Python scripts for simple GUI automation.

### [Demo](https://spaceymonk.github.io/automation-script-generator/)

## How to Use?

You start with `Start` block which is the entry point to your automation.

If you know the location (the X and Y coordinates) of the target element on
screen, then you should create a `Click` block and pass the arguments as the
numbers. Do not forget to connect these two blocks.

Say you do not know the target element's coordinates, then you should use a
`Find` block to get the parameters. `Find` block only checks whether or not the
target element is on the screen. If it is you can use the `x,y` string as the
arguments for the next `Click` block to click on that element.

If some time needs to pass use `Sleep` block to delay that thread.

If some of the work needs to be run simultaneously, you can fork your network by
connecting your source block to two or more blocks.

After you have created your network, click `Generate` to get Python script.

> This version does not support for loops. But since the program outputs a
> script you can add your loops or other optimizations by hand.

## How it works?

The program traverse your network and creates a Python script that utilizes the
[`pyautogui`](pyautogui.readthedocs.io) library to realize your automation. It
can detect forks and will create separate functions for each fork.

## Disclaimer

This tool designed to be a helper for another project of mine. I just wanted to
share it here, also.
