"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };

type State = { hasError: boolean };

export class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[50vh] items-center justify-center p-8">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-muted-subtle">
                Something went wrong
              </p>
              <p className="mt-2 text-sm text-muted">
                Please try refreshing the page.
              </p>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
