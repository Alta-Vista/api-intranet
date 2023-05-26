import { SetMetadata } from '@nestjs/common';

type PermissionsProps = {
  mustHaveAll?: boolean;
  permissions: string[];
};

const Permissions = ({
  mustHaveAll = false,
  permissions,
}: PermissionsProps) => {
  const perm = ['*', ...permissions];

  return SetMetadata('permissions', { mustHaveAll, permissions: perm });
};

export { Permissions };
