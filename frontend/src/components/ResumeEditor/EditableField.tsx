import { useRef, useEffect } from "react";

interface EditableFieldProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
    value,
    onChange,
    className = "",
    placeholder = "",
}) => {
    const ref = useRef<HTMLDivElement>(null);

    // Initialize only once or when value changes externally
    useEffect(() => {
        if (ref.current && ref.current.innerText !== value) {
            ref.current.innerText = value || placeholder;
        }
    }, [value, placeholder]);

    const handleInput = () => {
        if (ref.current) {
            onChange(ref.current.innerText);
        }
    };

    return (
        <div
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            className={`p-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[1.5em] ${className}`}
        />
    );
};

export default EditableField;
