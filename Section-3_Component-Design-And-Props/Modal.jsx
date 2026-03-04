// Section 3: Component Design & Props
// Design and implement a flexible Modal component with these features:
// - Open/close based on a prop
// - Accept custom content as children
// - Has a backdrop that closes the modal when clicked
// - Prevent body scroll when open
// - Support custom close button
// - Accessible (keyboard navigation, focus management)
// - Provide usage examples showing different ways to use your Modal component.

import React, { useEffect, useRef, useCallback, useState } from 'react';

export function Modal({
  isOpen,
  onClose,
  children,
  closeButton,
  ariaLabel,
  ariaLabelledBy
}) {
  const dialogRef = useRef(null);

  // Prevent body scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Focus management + keyboard handling (Esc, Tab trap)
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const dialog = dialogRef.current;
    const focusableSelectors =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const focusableElements = dialog.querySelectorAll(focusableSelectors);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus first focusable element or dialog itself
    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      dialog.focus();
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }

      if (e.key === 'Tab' && focusableElements.length > 0) {
        // simple focus trap
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    }

    dialog.addEventListener('keydown', handleKeyDown);

    return () => {
      dialog.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose?.();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      aria-hidden={!isOpen}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : ariaLabelledBy}
        tabIndex={-1}
        style={{
          background: '#fff',
          borderRadius: 8,
          padding: 24,
          maxWidth: 500,
          width: '90%',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          position: 'relative'
        }}
      >
        {/* Default close button if custom not provided */}
        {closeButton ? (
          closeButton
        ) : (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              border: 'none',
              background: 'transparent',
              fontSize: 20,
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        )}

        {children}
      </div>
    </div>
  );
}

// Usage examples
export default function ModalExamples() {
  const [isSimpleOpen, setIsSimpleOpen] = useState(false);
  const [isCustomCloseOpen, setIsCustomCloseOpen] = useState(false);

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Section 3 - Modal Demo</h2>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {/* Example 1: simple modal with default close button */}
        <button onClick={() => setIsSimpleOpen(true)}>Open simple modal</button>

        {/* Example 2: modal with custom close button & custom content */}
        <button onClick={() => setIsCustomCloseOpen(true)}>
          Open modal with custom close
        </button>
      </div>

      <Modal
        isOpen={isSimpleOpen}
        onClose={() => setIsSimpleOpen(false)}
        ariaLabel="Simple information modal"
      >
        <h3 style={{ marginTop: 0 }}>Simple Modal</h3>
        <p>Đây là nội dung đơn giản bên trong modal.</p>
        <button onClick={() => setIsSimpleOpen(false)}>Close</button>
      </Modal>

      <Modal
        isOpen={isCustomCloseOpen}
        onClose={() => setIsCustomCloseOpen(false)}
        ariaLabelledBy="custom-modal-title"
        closeButton={
          <button
            type="button"
            onClick={() => setIsCustomCloseOpen(false)}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid #ccc',
              background: '#f5f5f5',
              cursor: 'pointer'
            }}
          >
            Đóng
          </button>
        }
      >
        <h3 id="custom-modal-title" style={{ marginTop: 0 }}>
          Modal with Custom Close
        </h3>
        <p>
          Modal này dùng nút đóng tùy chỉnh và vẫn hỗ trợ backdrop click, phím
          Escape, trap focus.
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={() => alert('Action 1')}>Action 1</button>
          <button onClick={() => alert('Action 2')}>Action 2</button>
        </div>
      </Modal>
    </div>
  );
}

