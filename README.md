# Thyme connect

Thin layer which allows communication between Thyme and external scripts.

## How it works:

This following illustrates how the `thyme-connect` layer works.

### External script perspective

1. Import and call register function.
2. `thyme-connect` check if the Thyme function is available.
3. If it is available: call the function with the arguments.
4. If it's not available: store the call in an array with the arguments in the `window` object.

### Thyme perspective

1. Import `thyme-connect` layer.
2. Register the register function as available.
3. Execute list of calls stored in `thyme-connect` if present in the `window` object.
