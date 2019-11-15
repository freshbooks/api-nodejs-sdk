/* eslint-disable @typescript-eslint/camelcase */
import Error from './Error'
import PhoneNumber, { transformPhoneNumberResponse } from './PhoneNumber'
import Address, { transformAddressResponse, AddressResponse } from './Address'
import BusinessMembership, {
	transformBusinessMembershipResponse,
} from './BusinessMembership'
import Role, { transformRoleResponse } from './Role'
import Profession, { transformProfessionResponse } from './Profession'
import Group, { transformGroupResponse } from './Group'
import Permission from './Permission'
import { Nullable } from './helpers'

export default interface User {
	id: string
	firstName: string
	lastName: string
	email: string
	phoneNumbers?: Nullable<PhoneNumber[]>
	addresses?: Nullable<Address[]>
	permissions: Map<string, Map<string, Permission>>
	subscriptionStatuses: Map<string, string>
	businessMemberships?: Nullable<BusinessMembership[]>
	roles?: Nullable<Role[]>
	profession?: Nullable<Profession>
	groups?: Nullable<Group[]>
	links?: Nullable<Map<string, string>>
}

export function transformUserResponse(data: string): User | Error {
	const { response, error, error_description } = JSON.parse(data)

	if (error) {
		return {
			code: error,
			message: error_description,
		}
	}

	const {
		id,
		first_name,
		last_name,
		email,
		phone_numbers: phoneNumbers = [],
		addresses = [],
		permissions = {},
		subscriptionStatuses,
		businessMemberships = [],
		roles = [],
		profession,
		groups = [],
		links = {},
	} = response
	return {
		id: id.toString(), // store ids as string
		firstName: first_name,
		lastName: last_name,
		email,
		phoneNumbers: phoneNumbers.map(transformPhoneNumberResponse),
		permissions,
		subscriptionStatuses,
		businessMemberships: businessMemberships.map(
			transformBusinessMembershipResponse
		),
		roles: roles.map(transformRoleResponse),
		addresses: addresses
			.filter((address: Nullable<AddressResponse>) => address !== null)
			.map(transformAddressResponse),
		profession: transformProfessionResponse(profession),
		groups: groups.map(transformGroupResponse),
		links,
	}
}
