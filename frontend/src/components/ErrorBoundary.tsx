import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Typography } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
          <ErrorIcon className="text-red-500 text-6xl mb-4" />
          <Typography variant="h4" className="mb-4 text-center">
            Oops! Something went wrong
          </Typography>
          <Typography variant="body1" className="mb-6 text-center max-w-md text-gray-600 dark:text-gray-400">
            We're sorry, but an error occurred while rendering this page. Please try reloading the page or contact support if the problem persists.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleReload}
            className="px-6"
          >
            Reload Page
          </Button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-2xl w-full">
              <Typography variant="h6" className="mb-2 text-red-500">
                Error Details:
              </Typography>
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 dark:text-gray-300">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
