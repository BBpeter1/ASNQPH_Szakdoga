export interface UserDTO {
    id: number;
    name: string;
    phone: number;
    szisz: number;
    address: string;
    isActive: boolean;
    email: string;
    password: string;
    borrowedBooks: BookDTO[];
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface AccessTokenDTO {
    accessToken: string;
}


export interface StatusDTO {
    id: number;
    title: string;
}

export interface BookDTO {
    id: number;
    title: string;
    description: string;
    Author: string;
    date: string;
    borrowDate: string;
    category: string;
    status: string;
}
