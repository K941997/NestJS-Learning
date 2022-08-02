export enum UserTypeKey {
  ADMIN = 'admin',
  CLIENT = 'client',
}

export enum Action {
  MANAGE = 'manage',
  READ = 'read',
  WRITE = 'write',
}

export enum ActionAbility {
  CAN = 'can',
  CANNOT = 'cannot',
}



export enum Resource {
  ALL = 'all',
  USER = 'user',
  ADMIN = 'admin',
  VIDEO = 'video',
  AUDIO = 'audio',
  TOPIC = 'topic',
  LEVEL = 'level'
}

export enum MediaType {
  VIDEO = 'video',
  AUDIO = 'audio',
}
