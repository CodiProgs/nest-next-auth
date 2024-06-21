import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments
} from 'class-validator'

export function IsPasswordsMatching(
	property: string,
	validationOptions?: ValidationOptions
) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isPasswordsMatching',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [property],
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints
					const relatedValue = (args.object as any)[relatedPropertyName]
					return value === relatedValue
				},
				defaultMessage(args: ValidationArguments) {
					return args.property + ' does not match ' + args.constraints[0]
				}
			}
		})
	}
}
