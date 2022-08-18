class PluginBO {
  code: string;
}

export interface CreateFileVariantBO {
  uuid: string;
  plugins: PluginBO[];
}
