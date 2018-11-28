import { Component, ComponentInterface, Element, Listen, Prop } from '@stencil/core';

import { Color, Config, CssClassMap, Mode, StyleEvent } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-toolbar',
  styleUrls: {
    ios: 'toolbar.ios.scss',
    md: 'toolbar.md.scss'
  },
  shadow: true
})
export class Toolbar implements ComponentInterface {
  private childrenStyles = new Map<string, CssClassMap>();

  @Element() el!: HTMLStencilElement;

  @Prop({ context: 'config' }) config!: Config;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  @Listen('ionStyle')
  childrenStyle(ev: CustomEvent<StyleEvent>) {
    ev.stopPropagation();

    const tagName = (ev.target as HTMLElement).tagName;
    const updatedStyles = ev.detail;
    const newStyles = {} as any;
    const childStyles = this.childrenStyles.get(tagName) || {};

    let hasStyleChange = false;
    Object.keys(updatedStyles).forEach(key => {
      const childKey = `toolbar-${key}`;
      const newValue = updatedStyles[key];
      if (newValue !== childStyles[childKey]) {
        hasStyleChange = true;
      }
      if (newValue) {
        newStyles[childKey] = true;
      }
    });

    if (hasStyleChange) {
      this.childrenStyles.set(tagName, newStyles);
      this.el.forceUpdate();
    }
  }

  hostData() {
    const childStyles = {};
    this.childrenStyles.forEach(value => {
      Object.assign(childStyles, value);
    });

    return {
      class: {
        ...childStyles,
        ...createColorClasses(this.color)
      }
    };
  }

  render() {
    return [
      <div class="toolbar-background"></div>,
      <div class="toolbar-container">
        <slot name="start"></slot>
        <slot name="secondary"></slot>
        <div class="toolbar-content">
          <slot></slot>
        </div>
        <slot name="primary"></slot>
        <slot name="end"></slot>
      </div>
    ];
  }
}