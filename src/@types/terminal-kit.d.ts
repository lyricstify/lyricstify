import { EventEmitter } from 'stream';
import 'terminal-kit';
import { Rect } from 'terminal-kit';
import { ScreenBuffer, TextBuffer } from 'terminal-kit';

// TODO: Add missing document model classes, methods, and interfaces. Open PR to DefinitelyTyped.
declare module 'terminal-kit' {
  declare namespace Terminal {
    interface Impl {
      createDocument(options?: DocumentOptions): Document;
    }
  }

  interface ElementOptions {
    /**
     * The parent of the current element, the current element will be attached to it.
     */
    parent?: Element;
    /**
     * The horizontal coordinate of the element relative to its closest ancestor-container.
     */
    x?: number;
    /**
     * The vertical coordinate of the element relative to its closest ancestor-container.
     */
    y?: number;
    /**
     * The element z-index, greater z-index elements are rendered after (i.e. over) lesser z-index elements.
     */
    zIndex?: number;
    /**
     * Alias of zIndex.
     */
    z?: ElementOptions['zIndex'];
    /**
     * The general width of the element.
     */
    width?: number;
    /**
     * The general height of the element.
     */
    height?: number;
    /**
     * The width of the rendered element (inside its parent), for most widget it is the same than width and height and will default to them.
     */
    outputWidth?: number;
    /**
     * The height of the rendered element (inside its parent), for most widget it is the same than width and height and will default to them.
     */
    outputHeight?: number;
    /**
     * When set to a number greater than 0 and lesser than or equals to 1 (true=1), compute the width and/or height as a proportion of the parent Container width and/or height, e.g.: true or 1 use 100% of the parent Container.
     */
    autoWidth?: boolean | number;
    /**
     * When set to a number greater than 0 and lesser than or equals to 1 (true=1), compute the width and/or height as a proportion of the parent Container width and/or height, e.g.: true or 1 use 100% of the parent Container.
     */
    autoHeight?: boolean | number;
    /**
     * A label for this element, only relevant for some widgets.
     */
    label?: string;
    /**
     * A key for this element, only relevant for some widgets.
     */
    key?: string;
    /**
     * A value associated with this element, only relevant for some widgets.
     */
    value?: any;
    /**
     * The content of the element that will be displayed, if it makes sense for the widget.
     */
    content?: string;
    /**
     * When set to true or the string 'markup', the content contains Terminal Kit's markup, used to set attributes of parts of the content, when set to the string 'ansi', the content contains ANSI escape sequence, true and markup are only relevant for some widgets and ansi is even less supported.
     *
     * @default false
     */
    contentHasMarkup?: boolean | string;
    /**
     * The width (in terminal's cells) of the content, only relevant for some widgets.
     */
    contentWidth?: number;
    /**
     * When set, the element is not visible and no interaction is possible with this element. It also affects children.
     *
     * @default false
     */
    hidden?: boolean;
    /**
     * Mostly for user-input, the element is often grayed and unselectable, the effect depending on the widget.
     */
    disabled?: boolean;
    /**
     * Object having a Terminal Kit key name as the key and an action as value (see Document).
     */
    keyBindings?: object;
    /**
     * A userland-only property, it associates the element with some data that make sense in the application business-logic.
     */
    meta?: any;
    /**
     * If true, don't draw the document on instantiation.
     *
     * @default false
     */
    noDraw?: boolean;
  }

  class Element {
    constructor(options: ElementOptions);
    /**
     * Updates the z-index of the element and triggers all internal mechanism needed.
     *
     * @param z the new z-index for that element.
     */
    updateZ(z: number): void;
    /**
     * Alias of updateZ.
     */
    updateZIndex: Element['updateZ'];
    /**
     * It updates the z-index of the element so that it is above all sibling elements.
     */
    topZ(): void;
    /**
     * It updates the z-index of the element so that it is below all sibling elements.
     */
    bottomZ(): void;
    /**
     * Set the content of this element.
     *
     * @param content the new content for this element.
     * @param hasMarkup when set to true or the string 'markup', the content contains Terminal Kit's markup, used to set attributes of parts of the content, when set to the string 'ansi', the content contains ANSI escape sequence, default: false. NOTE: not all widget support markup or ansi!
     * @param dontDraw when set, the content's update does not trigger the draw/outerDraw of the element.
     */
    setContent(
      content: string,
      hasMarkup: boolean | string = false,
      dontDraw = false,
    ): void;
    /**
     * Turn the element visibility on and outerDraw it immediately (unless the dontDraw option is on).
     *
     * @param dontDraw when set the element is not drawn/outerDrawn (it will be made visible the next time something trigger a outerDraw).
     */
    show(dontDraw = false): void;
    /**
     * Turn the element visibility off and outerDraw its parent immediately (unless the dontDraw option is on).
     *
     * @param dontDraw when set, the element is not drawn/outerDrawn (it will be hidden the next time something trigger a outerDraw on its parent).
     */
    hide(dontDraw = false): void;
    /**
     * Draw the element on its parent. It is called internally/automatically, userland code should not be bothered with that, except in rare use-cases.
     */
    draw(): void;
    /**
     * Redraw the element. While .draw() is used when drawing the current element is enough (the element has not moved, and has not been resized), .outerDraw() is used when it is necessary to draw the closest ancestor which is a container.
     * It is called internally/automatically, userland code should not be bothered with that, except in rare use-cases.
     *
     * @param force When set the element is outerDrawn even if it is hidden: i.e. the parent is outerDrawn, it would effectively clear an hidden element from its parent.
     * @private
     */
    outerDraw(force = false): void;
    /**
     * Draw the element cursor, i.e. move it to the right place.
     * It is called internally/automatically, userland code should not be bothered with that, except in rare use-cases.
     */
    drawCursor(): void;
    /**
     * Save the element cursor position.
     */
    saveCursor(): void;
    /**
     * Restore the element cursor position.
     */
    restoreCursor(): void;
  }

  interface ContainerOptions {
    /**
     * The horizontal position of the inputDst relative to its outputDst, default to outputX, outputY or x, y when there is no clipping/scrolling
     */
    inputX?: number;
    /**
     * The vertical position of the inputDst relative to its outputDst, default to outputX, outputY or x, y when there is no clipping/scrolling
     */
    inputY?: number;
    /**
     * The size of the inputDst, default to outputWidth, outputHeight or width, height when there is no clipping/scrolling, i.e. when the inputDst is fully drawn into the outputDst
     */
    inputWidth?: number;
    /**
     * The size of the inputDst, default to outputWidth, outputHeight or width, height when there is no clipping/scrolling, i.e. when the inputDst is fully drawn into the outputDst
     */
    inputHeight?: number;
    /**
     * When set, the container can be moved using with a mouse drag.
     *
     * @default false
     */
    movable?: boolean;
    /**
     * If set, the container is scrollable.
     *
     * @default false;
     */
    scrollable?: boolean;
    /**
     * If set and if scrollable, the container has a horizontal scrollbar
     */
    hasHScrollBar?: boolean;
    /**
     * If set and if scrollable, the container has a vertical scrollbar.
     */
    hasVScrollBar?: boolean;
    /**
     * The initial horizontal scroll value.
     *
     * @default 0
     */
    scrollX?: number;
    /**
     * The initial vertical scroll value.
     *
     * @default 0
     */
    scrollY?: number;
    /**
     * TODO: https://github.com/cronvel/terminal-kit/blob/master/doc/Palette.md
     * A Palette instance, default to the current document's palette.
     */
    palette?: any;
    /**
     * The background attributes for the inputDst screenBuffer.
     *
     * @default { bgColor: 'default' }
     */
    backgroundAttr?: number | object;
  }

  class Container extends Element {
    /**
     * This property holds the underlying screenBuffer object. It can be used to achieve more complex stuffs.
     */
    inputDst: ScreenBuffer;

    constructor(options: ContainerOptions);
    /**
     * Resize the container viewport, the rectangle used to clip the inputDst before writing it to the outputDst.
     *
     * @param rect rect Rect or Rect-like object, see Rect.
     */
    resizeViewport(rect: Rect): void;
    /**
     * Resize this container own screenBuffer, the inputDst for its children to write on.
     *
     * @param rect rect Rect or Rect-like object, see Rect.
     */
    resizeInput(rect: Rect): void;
    /**
     * Resize both the inputDst and the viewport with the same size (like calling .resizeInput() and .resizeViewport() with the same arguments).
     *
     * @param rect rect Rect or Rect-like object, see Rect.
     */
    resize(rect: Rect): void;
    /**
     * Move that container relative to its current position. In other words, change the position of its own screenBuffer relative to its parent screenBuffer.
     *
     * @param dx number the delta of the horizontal position of the container relative to itself.
     * @param dy number the delta of the vertical position of the container relative to itself.
     */
    move(dx: number, dy: number): void;
    /**
     * Move that container to a position relative to its parent's container. In other words, change the position of its own screenBuffer relative to its parent screenBuffer.
     *
     * @param x the horizontal position of the container relative to its parent container.
     * @param y the vertical position of the container relative to its parent container.
     */
    moveTo(x: number, y: number): void;
    /**
     * This scrolls the container to the x,y coordinates and updates scrollbars.
     *
     * @param x number the new horizontal scrolling coordinates
     * @param y number the new vertical scrolling coordinates
     */
    scrollTo(x: number, y: number): void;
    /**
     * This scrolls the container from this x,y delta and updates scrollbars.
     *
     * @param dx number the delta of the scroll
     * @param dy number the delta of the scroll
     */
    scroll(dx: number, dy: number): void;
    /**
     * This scrolls the container to the top and updates scrollbars.
     */
    scrollToTop(): void;
    /**
     * This scrolls the container to the bottom and updates scrollbars.
     */
    scrollToBottom(): void;
  }

  interface DocumentOptions {
    /**
     * The object where the document should be drawn into, it is set automatically when using term.createDocument() instead of new termkit.Document().
     */
    outputDst?: Terminal | ScreenBuffer;
    /**
     * EventEmitter or any EventEmitter-compatible objects (e.g. nextgen-events) it is set automatically when using term.createDocument() instead of new termkit.Document().
     */
    eventSource?: EventEmitter;
    /**
     * The horizontal position of the document with respect to the screen (i.e. the outputDst).
     */
    outputX?: number;
    /**
     * The vertical position of the document with respect to the screen (i.e. the outputDst).
     */
    outputY?: number;
    /**
     * The width size of the document with respect to the screen (i.e. the outputDst).
     */
    outputWidth?: number;
    /**
     * The height size of the document with respect to the screen (i.e. the outputDst).
     */
    outputHeight?: number;
    /**
     * Having a Terminal Kit key name as the key and an action as value.
     *
     * @default { focusNext: 'TAB', focusPrevious: 'SHIFT_TAB' }
     */
    keyBindings?: { focusNext: string; focusPrevious: string };
    /**
     * If true, don't draw the document on instantiation (default: false, draw immediately)
     */
    noDraw?: boolean;
  }

  class Document extends Container {
    constructor(options: DocumentOptions & ContainerOptions);
    /**
     * Give the focus to an Element.
     *
     * @param element the element to give focus to.
     */
    giveFocusTo(element: Element): void;
    /**
     * Give the focus to the next focusable Element. This is usually done internally when the user press the TAB key or any keys binded to the focusNext action.
     */
    focusNext(): void;
    /**
     * Give the focus to the previous focusable Element. This is usually done internally when the user press the SHIFT_TAB key or any keys binded to the focusPrevious action.
     */
    focusPrevious(): void;
  }

  interface TextBoxOptions {
    /**
     * When set to true or the string 'markup', the content contains Terminal Kit's markup, used to set attributes of parts of the content, when set to the string 'ansi', the content contains ANSI escape sequence
     *
     * @default false
     */
    contentHasMarkup?: boolean | string;
    /**
     * General attribute for the textBox.
     */
    attr?: object;
    /**
     * Attribute for the text content.
     *
     * @default { bgColor: 'default' }
     */
    textAttr?: object;
    /**
     * Alternate attribute for the text.
     *
     * @default { ...this.textAttr, color: 'gray', italic: true }
     */
    altTextAttr?: object;
    /**
     * Attribute for the area of the textBox without any text content.
     *
     * @default { bgColor: 'default' }
     */
    voidAttr?: object;
    /**
     * Alias of voidAttr.
     */
    emptyAttr?: TextBoxOptions['voidAttr'];
    /**
     * If set, the textBox is scrollable.
     *
     * @default false
     */
    scrollable?: boolean;
    /**
     * If set and if scrollable, the textBox has a horizontal scrollbar.
     */
    hasHScrollBar?: boolean;
    /**
     * If set and if scrollable, the textBox has a vertical scrollbar.
     */
    hasVScrollBar?: boolean;
    /**
     * The initial horizontal scroll value.
     *
     * @default 0
     */
    scrollX?: number;
    /**
     * The initial vertical scroll value.
     *
     * @default 0
     */
    scrollY?: number;
    /**
     * If unset (the default), it is possible to scroll down until both the content bottom and textBox bottom are on the same line, if set, it is possible to scroll down until the bottom of the content reaches the top of the textBox
     */
    extraScrolling?: boolean;
    /**
     * Number of cells (=spaces) for the tab character.
     *
     * @default 4
     */
    tabWidth?: number;
    /**
     * When set, the text content is wrapped to the next line instead of being clipped by the textBox border.
     */
    lineWrap?: boolean;
    /**
     * Like lineWrap but is word-aware, i.e. it doesn't split words
     */
    wordWrap?: boolean;
    /**
     * If set, the first-line of content is right-shifted from this amount of cells, may be useful for prompt, or continuing another box in the flow.
     *
     * @default 0
     */
    firstLineRightShift?: number;
    /**
     * If set, the content is hidden, using this string as a replacement for all chars (useful for password).
     */
    hiddenContent?: string | null;
  }

  class TextBox extends Element {
    /**
     * The underlying TextBuffer object.
     */
    textBuffer: TextBuffer;

    constructor(options: TextBoxOptions & ElementOptions);
    /**
     * This set the size and position of the textBox, updating line-wrapping and scrollbar.
     */
    setSizeAndPosition({
      x,
      y,
      width,
      height,
    }: {
      x: number;
      y: number;
      width: number;
      height: number;
    }): void;
    /**
     * This scrolls the textBox to the x,y coordinates and updates scrollbars.
     *
     * @param x the new scrolling horizontal coordinates.
     * @param y the new scrolling vertical coordinates.
     */
    scrollTo(x: number, y: number): void;
    /**
     * This scrolls the textBox from this x,y delta and updates scrollbars.
     *
     * @param dx the horizontal delta of the scroll.
     * @param dy the vertical delta of the scroll.
     */
    scroll(dx: number, dy: number): void;
    /**
     * Scrolls the textBox to the top and updates scrollbars.
     */
    scrollToTop(): void;
    /**
     * This scrolls the textBox to the bottom and updates scrollbars.
     */
    scrollToBottom(): void;
    /**
     * It returns the current text-content.
     */
    getContent(): string;
    /**
     * It returns the current text-content size, an object with a width and height property.
     */
    getContentSize(): { width: number; height: number };
    /**
     * Prepend text-content at the begining of the current content. It supports markup or ansi if the textBox was instanciated with the contentHasMarkup options on.
     *
     * @param content the text-content to prepend.
     * @param dontDraw if set, don't outerDraw the widget.
     */
    prependContent(content: string, dontDraw = false): void;
    /**
     * Append text-content at the end of the current content. It supports markup or ansi if the textBox was instanciated with the contentHasMarkup options on.
     *
     * @param content the text-content to append.
     * @param dontDraw if set, don't outerDraw the widget.
     */
    appendContent(content: string, dontDraw = false): void;
    /**
     * This method is almost like .appendContent(), but more suitable for logging. It appends a new line of text-content at the end of the current content. Then it performs an intelligent scroll of the textBox: if the scrolling was already at the bottom, it will scroll down so that new content will be in the viewport. It supports markup or ansi if the textBox was instanciated with the contentHasMarkup options on.
     *
     * @param content the text-content to append
     * @param dontDraw if set, don't outerDraw the widget
     */
    appendLog(content: string, dontDraw = false): void;
    /**
     * It returns the alternate text-content.
     */
    getAltContent(): string;
    /**
     * Set the alternate text-content, work like its .setContent() counterpart.
     *
     * @param content the alternate text-content.
     * @param hasMarkup when set to true or the string 'markup', the content contains Terminal Kit's markup, used to set attributes of parts of the content, when set to the string 'ansi', the content contains ANSI escape sequence.
     * @param dontDraw if set, don't outerDraw the widget.
     */
    setAltContent(
      content: string,
      hasMarkup: boolean | string = false,
      dontDraw = false,
    ): void;
  }
}
