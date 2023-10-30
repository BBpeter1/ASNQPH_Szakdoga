export interface UserDTO {
    id: number;
    name: string;
    phone: string;
    szisz: string;
    address: string;
    isActive: boolean;
    email: string;
    password: string;
    borrowedBooks: BookDTO[];
    soldBooks: BookDTO[];
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface AccessTokenDTO {
    accessToken: string;
}

export interface AuthorDTO
{
    id: number;
    name: string;
    biography: string;
}

export interface BookDTO {
    id: number;
    title: string;
    price:number;
    description: string;
    Author: string;
    date: string;
    borrowDate: string;
    soldDate: string;
    category: string;
    status: string;
    delay:number;
}
