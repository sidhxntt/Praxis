import { To } from "react-router-dom";
import { ReactNode } from "react";
import { PinInputField } from "@/components/AdminDashboard/AdminDashboardComponents/PinInput";
import { type JSX } from "react";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Team {
  name: string;
  logo: React.ElementType;
  plan: string;
}

interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
}

type NavLink = BaseNavItem & {
  url: To; // Use 'To' type from react-router-dom
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: To })[];
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarData {
  user: User;
  teams: Team[];
  navGroups: NavGroup[];
}

interface NavbarProps {
  logo: string;
  links: { id?: string; label: string; href: string }[];
  optionalElements?: React.ReactNode[] | string[];
}

interface FooterProps {
  logo: string;
  description?: string;
  links: {
    title?: string;
    items: { label: string | React.ReactNode; href: string }[];
  }[];
  additionalContent?: React.ReactNode | string;
}

interface ScrollLinkProps {
  to: string;
  id?: string;
  children: ReactNode;
  className?: string;
}

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};
interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}
interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}
interface LoginFormInputs {
  email: string;
  password: string;
}

interface SignupFormInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface MaxWidthWrapperProps {
  className?: string;
  children: React.ReactNode;
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  disabled?: boolean;
  desc: React.JSX.Element | string;
  cancelBtnText?: string;
  confirmText?: React.ReactNode;
  destructive?: boolean;
  handleConfirm: () => void;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface LongText_Props {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

interface Search_Props {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
}
interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    title: string;
    href: string;
    isActive: boolean;
    disabled?: boolean;
  }[];
}

interface PinInputProps {
  children:
    | React.ReactElement<typeof PinInputField>
    | React.ReactElement<typeof PinInputField>[];
  /**
   * className for the input container
   */
  className?: string;
  /**
   * `aria-label` for the input fields
   */
  ariaLabel?: string;
  /**
   * If set, the pin input receives focus on mount, `false` by default
   */
  autoFocus?: boolean;
  /**
   * Called when value changes
   */
  onChange?: (value: string) => void;
  /**
   * Called when all inputs have valid value
   */
  onComplete?: (value: string) => void;
  /**
   * Called when any input doesn't have value
   */
  onIncomplete?: (value: string) => void;
  /**
   * `name` attribute for input fields
   */
  name?: string;
  /**
   * `form` attribute for hidden input
   */
  form?: string;
  /**
   * If set, the input's value will be masked just like password input. This field is `false` by default
   */
  mask?: boolean;
  /**
   * If set, the pin input component signals to its fields that they should
   * use `autocomplete="one-time-code"`. This field is `false` by default
   */
  otp?: boolean;
  /**
   * Uncontrolled pin input default value.
   */
  defaultValue?: string;
  /**
   * Controlled pin input value.
   */
  value?: string;
  /**
   * The type of value pin input should allow, `alphanumeric` by default
   */
  type?: "numeric" | "alphanumeric";
  /**
   * Placeholder for input fields, `○` by default
   */
  placeholder?: string;
  /**
   * If set, the user cannot set the value, `false` by default
   */
  readOnly?: boolean;
  /**
   * If set, the input fields are disabled, `false` by default
   */
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}
interface _PinInputFieldProps {
  mask: boolean;
  inputKey: string;
  type: "numeric" | "alphanumeric";
}

interface PinInputFieldProps<T>
  extends Omit<
    React.ComponentPropsWithoutRef<"input">,
    keyof _PinInputFieldProps
  > {
  component?: T;
}
interface UsePinInputProps {
  value: string | undefined;
  defaultValue: string | undefined;
  placeholder: string;
  type: "numeric" | "alphanumeric";
  length: number;
  readOnly: boolean;
}
interface SelectDropdownProps {
  onValueChange?: (value: string) => void;
  defaultValue: string | undefined;
  placeholder?: string;
  isPending?: boolean;
  items: { label: string; value: string }[] | undefined;
  disabled?: boolean;
  className?: string;
  isControlled?: boolean;
}
interface ContentSectionProps {
  title: string;
  desc: string;
  children: React.JSX.Element;
}
interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: JSX.Element;
  }[];
}
interface PricingPlan {
  name: string;
  price?: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}

export type {
  SidebarData,
  NavGroup,
  NavItem,
  NavCollapsible,
  NavLink,
  NavbarProps,
  FooterProps,
  ScrollLinkProps,
  ParticlesProps,
  GlowingEffectProps,
  GridItemProps,
  LoginFormInputs,
  SignupFormInputs,
  MaxWidthWrapperProps,
  ConfirmDialogProps,
  LongText_Props,
  Search_Props,
  HeaderProps,
  MainProps,
  TopNavProps,
  PinInputFieldProps,
  UsePinInputProps,
  PinInputProps,
  _PinInputFieldProps,
  SelectDropdownProps,
  SidebarNavProps,
  ContentSectionProps,
  PricingPlan,
};
