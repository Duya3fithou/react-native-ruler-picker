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
};

type Props = {
  index: number;
  isLast: boolean;
} & RulerPickerItemProps;

export const RulerPickerItem = React.memo(
  ({
    isLast,
    index,
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
    // Nếu có ít hơn 15 items, chỉ item đầu và cuối là long step
    // Ngược lại, áp dụng rule cũ: mỗi 10 item và item cuối
    const isLong = totalItems && totalItems < 15
      ? (index === 0 || isLast)
      : (index % 10 === 0 || isLast);
    const height = isLong ? longStepHeight : shortStepHeight;
    const textWidth = displayMode === 'feet' ? 45 : 30;
    const textLeft = displayMode === 'feet' ? -20 : -15;

    // Tính toán giá trị hiển thị dựa trên displayMode
    let value;
    switch (displayMode) {
      case 'integer':
        value = Math.round(index * step + min).toString();
        break;
      case 'tens':
        value = Math.round((index * step + min) / 10) * 10;
        break;
      case 'feet': {
        // Giả sử min/step là inch, hoặc bạn có thể điều chỉnh lại cho phù hợp
        const totalInches = index * step + min;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        value = `${feet}' ${inches}\"`;
        break;
      }
      case 'decimal':
      default:
        value = (index * step + min).toFixed(fractionDigits);
    }

    return (
      <View
        style={[
          {
            width: stepWidth,
            height: '100%',
            justifyContent: 'center',
            marginRight: isLast ? 0 : gapBetweenSteps,
            marginTop: shortStepHeight,
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
