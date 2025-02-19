import { prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUserModel extends Base {}

export class UserModel extends TimeStamps {
	@prop({
		unique: true
	})
	email: string

	@prop()
	password: string

	@prop({
		default: false
	})
	isAdmin?: boolean

	@prop({
		default: []
	})
	favorites?: []
}
