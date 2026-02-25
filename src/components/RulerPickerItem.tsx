/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, View } from 'react-native';

export type RulerPickerItemProps = {
  /**
   * Gap between steps
   *
   * @default 10
   */
  gapBetweenSteps: number;
  /**
   * Height of the short step
   *
   * @default 20
   */
  shortStepHeight: number;
  /**
   * Height of the long step
   *
   * @default 40
   */
  longStepHeight: number;
  /**
   * Width of the steps
   *
   * @default 2
   */
  stepWidth: number;
  /**
   * Color of the short steps
   *
   * @default 'lightgray'
   */
  shortStepColor: string;
  /**
   * Color of the long steps
   *
   * @default 'gray'
   */
  longStepColor: string;
  /**
   * Initial value of the ruler picker
   *
   * @default 0
   */
  min: number;
  /**
   * Step of the ruler picker
   *
   * @default 1
   */
  step: number;
  /**
   * Number of decimal places to display
   *
   * @default 1
   */
  fractionDigits?: number;
  /**
   * Display mode for the numbers
   * 'decimal' - show decimal numbers (4.1, 4.2, 4.3...)
   * 'integer' - show only integers (4, 5, 6, 7...)
   * 'tens' - show numbers in tens (10, 20, 30...)
   * 'feet' - show height in feet and inches (5' 8")
   *
   * @default 'decimal'
   */
  displayMode?: 'decimal' | 'integer' | 'tens' | 'feet';
  /**
   * Total number of items in the ruler
   */
  totalItems?: number;
  /**
   * Mark item as inactive (outside min/max range)
   * to render with lower opacity
   */
  isInactive?: boolean;
  /**
   * Index của vạch min trong toàn bộ mảng (dùng để dịch index)
   */
  firstAvailableIndex?: number;
  /**
   * Index của vạch max (item cuối available) trong toàn bộ mảng
   * Luôn hiển thị là vạch dài (isLong)
   */
  lastAvailableIndex?: number;
};

type Props = {
  index: number;
  isLast: boolean;
} & RulerPickerItemProps;

export const RulerPickerItem = React.memo(
  ({
    isLast,
    index,
    isInactive = false,
    firstAvailableIndex = 0,
    lastAvailableIndex,
    gapBetweenSteps,
    shortStepHeight,
    longStepHeight,
    stepWidth,
    shortStepColor,
    longStepColor,
    min,
    step,
    fractionDigits = 1,
    displayMode = 'decimal',
    totalItems,
  }: Props) => {
    // Index tương đối, tính từ vạch min
    const relativeIndex = index - firstAvailableIndex;

    // Item cuối available (max) luôn là vạch dài.
    // Nếu có ít hơn 15 items available: chỉ item đầu available (min) và cuối available (max) là long step.
    // Ngược lại: mỗi 10 item (theo relativeIndex) và item cuối available (max).
    const isLastAvailable = lastAvailableIndex !== undefined && index === lastAvailableIndex;
    const isLong =
      totalItems && totalItems < 15
        ? index === firstAvailableIndex || isLastAvailable
        : relativeIndex % 10 === 0 || isLastAvailable;
    const height = isLong ? longStepHeight : shortStepHeight;


    // Tính toán giá trị hiển thị dựa trên displayMode
    let value;
    switch (displayMode) {
      case 'integer':
        value = Math.round(relativeIndex * step + min).toString();
        break;
      case 'tens':
        value = Math.round((relativeIndex * step + min) / 10) * 10;
        break;
      case 'feet': {
        // Giả sử min/step là inch, hoặc bạn có thể điều chỉnh lại cho phù hợp
        const totalInches = relativeIndex * step + min;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        value = `${feet}' ${inches}\"`;
        break;
      }
      case 'decimal':
      default:
        value = (relativeIndex * step + min).toFixed(fractionDigits);
    }

    const textWidth = displayMode === 'feet' ? 45 : 30;
    const textLeft = displayMode === 'feet' ? -20 : -15;

    return (
      <View
        style={[
          {
            width: stepWidth,
            height: '100%',
            justifyContent: 'center',
            marginRight: isLast ? 0 : gapBetweenSteps,
            marginTop: shortStepHeight,
            opacity: isInactive ? 0.3 : 1,
          },
        ]}
      >
        {isLong && (
          <Text
            style={{
              color: 'white',
              width: textWidth,
              position: 'absolute',
              left: textLeft,
              top: 0,
              textAlign: 'center',
            }}
          >
            {value}
          </Text>
        )}

        <View
          style={[
            {
              width: '100%',
              height: height,
              backgroundColor: isLong ? longStepColor : shortStepColor,
              marginTop: isLong ? 0 : shortStepHeight,
            },
          ]}
        />
      </View>
    );
  }
);
