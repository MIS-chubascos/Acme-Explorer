import { Entity } from './entity.model';

export class Actor extends Entity {

    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    address: string;
    password: string;
    banned: Boolean;
    actorType: [String];
    customToken: string;

}
