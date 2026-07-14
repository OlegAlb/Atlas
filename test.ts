type Nullable<T> = null | T

const a: Nullable<number> = 4

type ApiResponse<T> = {
  state: "succes" | "error",
  data?: T
}

type UserResponse = {
  id: number,
  name: string
}

const abc: ApiResponse<UserResponse> = {
  state: "error",
  data: {
    id,
    name
  }
}