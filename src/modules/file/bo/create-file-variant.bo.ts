class PluginBO {
  code: string;
}

export class CreateFileVariantBO {
  uuid: string;
  plugins: PluginBO[];

  constructor(partial: Partial<CreateFileVariantBO> = {}) {
    Object.assign(this, partial);
  }
}
