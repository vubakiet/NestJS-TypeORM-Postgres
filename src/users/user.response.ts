export class UserResponse {
    id: number;
    firstname: string;
    lastname: string;
    birthday: string;

    constructor(data?: any) {
        console.log(data);

        this.id = data?.id || 0;
        this.firstname = data?.firstname || '';
        this.lastname = data?.lastname || '';
        this.birthday = data?.birthday || '';
    }

    static mapToList(data?: any[]) {
        return data.map((item) => new UserResponse(item));
    }
}
