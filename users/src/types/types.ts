export interface User {
    id: number;
    firstName: string;
    lastName: string;
    height: number;
    weight: number;
    gender: string;
    location: string;
    photo?: string;
}
  
export interface UsersState {
    users: User[];
    currentUser: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}
  
export interface ApiError {
    message: string;
}