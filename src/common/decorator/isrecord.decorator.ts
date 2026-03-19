import { registerDecorator, ValidationOptions, ValidationArguments, isObject, isNumber } from "class-validator";

export const IsRecord = (validationOptions?: ValidationOptions) => {
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            name: "IsRecord",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: "Wrong object format",
                ...validationOptions,
            },
            validator: {
                validate(value: unknown, args: ValidationArguments) {
                    if (!isObject(value)) return false;
                    if (Object.keys(value).length === 0) return true;

                    const keys = Object.keys(value);

                    return keys.every(key => {
                        if (typeof key !== "string") return false;
                        if (!isNumber(value[key])) return false;

                        return true;
                    });
                },
            },
        });
    };
};
