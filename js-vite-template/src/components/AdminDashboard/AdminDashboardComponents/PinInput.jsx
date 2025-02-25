import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  createContext,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { cn } from "@/lib/utils";

const PinInputContext = createContext(false);

const PinInput = ({ className, children, ...props }) => {
  const {
    defaultValue,
    value,
    onChange,
    onComplete,
    onIncomplete,
    placeholder = "○",
    type = "alphanumeric",
    name,
    form,
    otp = false,
    mask = false,
    disabled = false,
    readOnly = false,
    autoFocus = false,
    ariaLabel = "",
    ...rest
  } = props;

  const validChildren = getValidChildren(children);
  const length = getInputFieldCount(children);

  const { pins, pinValue, refMap, ...handlers } = usePinInput({
    value,
    defaultValue,
    placeholder,
    type,
    length,
    readOnly,
  });

  useEffect(() => {
    if (onChange) onChange(pinValue);
  }, [onChange, pinValue]);

  const completeRef = useRef(pinValue.length === length);
  useEffect(() => {
    if (pinValue.length === length && !completeRef.current) {
      completeRef.current = true;
      if (onComplete) onComplete(pinValue);
    }
    if (pinValue.length !== length && completeRef.current) {
      completeRef.current = false;
      if (onIncomplete) onIncomplete(pinValue);
    }
  }, [length, onComplete, onIncomplete, pinValue, pins, value]);

  useEffect(() => {
    if (autoFocus) {
      const node = refMap?.get(0);
      if (node) node.focus();
    }
  }, [autoFocus, refMap]);

  let counter = 0;
  const clones = validChildren.map((child) => {
    if (child.type === PinInputField) {
      const pinIndex = counter++;
      return cloneElement(child, {
        name,
        inputKey: `input-${pinIndex}`,
        value: length > pinIndex ? pins[pinIndex] : "",
        onChange: (e) => handlers.handleChange(e, pinIndex),
        onFocus: (e) => handlers.handleFocus(e, pinIndex),
        onBlur: () => handlers.handleBlur(pinIndex),
        onKeyDown: (e) => handlers.handleKeyDown(e, pinIndex),
        onPaste: (e) => handlers.handlePaste(e),
        placeholder,
        type,
        mask,
        autoComplete: otp ? "one-time-code" : "off",
        disabled,
        readOnly,
        "aria-label": ariaLabel || `Pin input ${counter} of ${length}`,
        ref: (node) => {
          if (node) refMap?.set(pinIndex, node);
          else refMap?.delete(pinIndex);
        },
      });
    }
    return child;
  });

  return (
    <PinInputContext.Provider value={true}>
      <div aria-label="Pin Input" className={className} {...rest}>
        {clones}
        <input type="hidden" name={name} form={form} value={pinValue} />
      </div>
    </PinInputContext.Provider>
  );
};
PinInput.displayName = "PinInput";

const PinInputField = ({ className, component, ...props }) => {
  const { mask, type, inputKey, ...rest } = props;

  const isInsidePinInput = useContext(PinInputContext);
  if (!isInsidePinInput) {
    throw new Error(
      `PinInputField must be used within ${PinInput.displayName}.`
    );
  }

  const Element = component || "input";

  return (
    <Element
      key={inputKey}
      type={mask ? "password" : type === "numeric" ? "tel" : "text"}
      inputMode={type === "numeric" ? "numeric" : "text"}
      className={cn("size-10 text-center", className)}
      {...rest}
    />
  );
};

const usePinInput = ({
  value,
  defaultValue,
  placeholder,
  type,
  length,
  readOnly,
}) => {
  const pinInputs = useMemo(
    () =>
      Array.from({ length }, (_, index) =>
        defaultValue
          ? defaultValue.charAt(index)
          : value
          ? value.charAt(index)
          : ""
      ),
    [defaultValue, length, value]
  );

  const [pins, setPins] = useState(pinInputs);
  const pinValue = pins.join("").trim();

  useEffect(() => {
    setPins(pinInputs);
  }, [pinInputs]);

  const itemsRef = useRef(new Map());

  const getNode = (index) => itemsRef.current.get(index);
  const focusInput = (index) => {
    const node = getNode(index);
    if (node) {
      node.focus();
      node.placeholder = "";
    }
  };

  const handleFocus = (event, index) => {
    event.target.select();
    focusInput(index);
  };

  const handleBlur = (index) => {
    const node = getNode(index);
    if (node) node.placeholder = placeholder;
  };

  const updateInputField = (val, index) => {
    const node = getNode(index);
    if (node) node.value = val;

    setPins((prev) => prev.map((p, i) => (i === index ? val : p)));
  };

  const validate = (value) => {
    const NUMERIC_REGEX = /^[0-9]+$/;
    const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]+$/i;
    const regex = type === "alphanumeric" ? ALPHA_NUMERIC_REGEX : NUMERIC_REGEX;
    return regex.test(value);
  };

  const pastedVal = useRef(null);
  const handleChange = (e, index) => {
    const inputValue = e.target.value;
    const pastedValue = pastedVal.current;
    const inputChar =
      pastedValue && pastedValue.length === length
        ? pastedValue.charAt(length - 1)
        : inputValue.slice(-1);

    if (validate(inputChar)) {
      updateInputField(inputChar, index);
      pastedVal.current = null;
      if (inputValue.length > 0) focusInput(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const copyValue = event.clipboardData
      .getData("text/plain")
      .replace(/[\n\r\s]+/g, "");
    const copyArr = copyValue.split("").slice(0, length);

    if (!copyArr.every((c) => validate(c))) return;

    copyArr.forEach((char, i) => updateInputField(char, i));

    pastedVal.current = copyValue;
    focusInput(copyArr.length < length ? copyArr.length : length - 1);
  };

  const handleKeyDown = (event, index) => {
    const { ctrlKey, key, shiftKey, metaKey } = event;

    if (
      type === "numeric" &&
      !/^\d$|Backspace|Tab|Delete|ArrowLeft|ArrowRight| /.test(key) &&
      !(ctrlKey && key === "v") &&
      !(metaKey && key === "v")
    ) {
      event.preventDefault();
    }

    if (key === "ArrowLeft" || (shiftKey && key === "Tab")) {
      event.preventDefault();
      focusInput(index - 1);
    } else if (key === "ArrowRight" || key === "Tab" || key === " ") {
      event.preventDefault();
      focusInput(index + 1);
    } else if (key === "Backspace") {
      event.preventDefault();
      updateInputField("", index);
      if (!event.target.value) focusInput(index - 1);
    }
  };

  return {
    pins,
    pinValue,
    refMap: itemsRef.current,
    handleFocus,
    handleBlur,
    handleChange,
    handlePaste,
    handleKeyDown,
  };
};

const getValidChildren = (children) =>
  Children.toArray(children).filter(isValidElement);

const getInputFieldCount = (children) =>
  Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === PinInputField
  ).length;

export { PinInput, PinInputField };
