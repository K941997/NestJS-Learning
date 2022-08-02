export enum BooleanEnum {
  TRUE = 1, //turn on for client can see, both admin and client can see
  FALSE = -1, //turn off for client can not see, show for only admin can see
}

export enum StatusEnum {
  AVAILABLE = 'available', //show for both client and admin can see
  SOLD_OUT = 'sold-out', //show for both client and admin can see
  HARD_TO_FIND = 'hard-to-find', //show for both client and admin can see
}

export enum SortKeyEnum {
  FEATURED = 'FEATURED',
  PRICE = 'PRICE',
  RATING = 'RATING', //rating từ người dùng vote sao
}

export enum SortDirectionEnum {
  DESC = 'DESC',
  ASC = 'ASC',
}
