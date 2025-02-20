import React, { useEffect, useState } from "react";
import { DateRangePicker as HeroDateRangePicker } from "@heroui/date-picker";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { DateValue, parseDate } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import moment from "moment";
import { RangeValue } from "@heroui/react";

interface DateRangePickerProps {
  onDateRangeChange: (startDate: moment.Moment | null, endDate: moment.Moment | null) => void;
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
}

export const ChevronDownIcon = () => {
  return (
    <svg fill="none" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default function DateRangePickerComponent({ onDateRangeChange, startDate, endDate }: DateRangePickerProps) {
  const [value, setValue] = useState<RangeValue<DateValue>>({
    start: startDate ? parseDate(startDate.format('YYYY-MM-DD')) : parseDate("2023-09-01"),
    end: endDate ? parseDate(endDate.format('YYYY-MM-DD')) : parseDate("2099-01-01")
  });

  const [initialValue, setInitialValue] = useState<RangeValue<DateValue>>(value);

  useEffect(() => {
    setValue({
      start: startDate ? parseDate(startDate.format('YYYY-MM-DD')) : parseDate("2023-09-01"),
      end: endDate ? parseDate(endDate.format('YYYY-MM-DD')) : parseDate("2099-01-01")
    });
  }, [startDate, endDate]);

  let formatter = useDateFormatter({ dateStyle: "full" });

  const handleChange = () => {
    if (
      initialValue.start?.toString() !== value.start?.toString() ||
      initialValue.end?.toString() !== value.end?.toString()
    ) {
      onDateRangeChange(
        value.start ? moment(value.start.toString()) : null,
        value.end ? moment(value.end.toString()) : null
      );
    }
  };

  const handleDateChange = (range: RangeValue<DateValue> | null) => {
    if (range) {
      setValue(range);
    }
  };

  const handleFocus = () => {
    setInitialValue(value);
  };

  const handlePopClose = (isOpen: boolean) => {
    if(!isOpen){
      handleChange();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleChange();
    }
  };

  const [selectedOption, setSelectedOption] = React.useState(new Set([" "]));

  const descriptionsMap = {
    todo: "Rango completo de fechas",
    range2023: "Rango del año 2023",
    range2024: "Rango del año 2024",
    range2025: "Rango del año 2025",
    rangeLT: "Rango de fechas del Limited Test de CS2",
    rangeT1: "Rango de fechas de la temporada 1 de CS2",
    rangeT2: "Rango de fechas de la temporada 2 de CS2",
  };

  const labelsMap = {
    todo: "Todo",
    range2023: "2023",
    range2024: "2024",
    range2025: "2025",
    rangeLT: "Limited test",
    rangeT1: "Temporada 1",
    rangeT2: "Temporada 2",
  };

  const datesMap = {
    todo: ["2023-09-01", "2099-01-01"],
    range2023: ["2023-01-01", "2023-12-31"],
    range2024: ["2024-01-01", "2024-12-31"],
    range2025: ["2025-01-01", "2025-12-31"],
    rangeLT: ["2023-09-01", "2023-09-27"],
    rangeT1: ["2023-09-28", "2025-01-26"],
    rangeT2: ["2025-01-26", "2025-12-31"],
  }

  // Convert the Set to an Array and get the first value.
  const selectedOptionValue = Array.from(selectedOption)[0] as keyof typeof labelsMap;

  const handleDropdownSelectionChange = (keys: any) => {
    setSelectedOption(keys);
    const selectedKey = Array.from(keys)[0] as keyof typeof datesMap;
    const [newStartDate, newEndDate] = datesMap[selectedKey];
    setValue({
      start: parseDate(newStartDate),
      end: parseDate(newEndDate)
    });
  };

  return (
    <div className="flex flex-row items-center space-x-2">
      <HeroDateRangePicker
        className="max-w-64 text-black"
        label="Rango temporal"
        value={value}
        onChange={handleDateChange}
        onOpenChange={handlePopClose}
        onFocus={handleFocus}
        onKeyUp={handleKeyUp}
      />
      <ButtonGroup variant="flat">
        <Button onPress={handleChange}>Refrescar</Button>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly>
              <ChevronDownIcon />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Merge options"
            className="max-w-[300px]"
            selectedKeys={selectedOption}
            selectionMode="single"
            onSelectionChange={handleDropdownSelectionChange}
          >
            <DropdownItem key="todo" description={descriptionsMap["todo"]}>
              {labelsMap["todo"]}
            </DropdownItem>
            <DropdownItem key="range2023" description={descriptionsMap["range2023"]}>
              {labelsMap["range2023"]}
            </DropdownItem>
            <DropdownItem key="range2024" description={descriptionsMap["range2024"]}>
              {labelsMap["range2024"]}
            </DropdownItem>
            <DropdownItem key="range2025" description={descriptionsMap["range2025"]}>
              {labelsMap["range2025"]}
            </DropdownItem>
            <DropdownItem key="rangeLT" description={descriptionsMap["rangeLT"]}>
              {labelsMap["rangeLT"]}
            </DropdownItem>
            <DropdownItem key="rangeT1" description={descriptionsMap["rangeT1"]}>
              {labelsMap["rangeT1"]}
            </DropdownItem>
            <DropdownItem key="rangeT2" description={descriptionsMap["rangeT2"]}>
              {labelsMap["rangeT2"]}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </ButtonGroup>
    </div>
  );
}