export interface IComments {
  id: string;
  user_id: string;
  task_id: string;
  text: string;
}

export interface IPaginatedComments {
  data: IComments[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
