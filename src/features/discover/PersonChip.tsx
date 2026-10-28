import { Link } from 'react-router-dom';

import { Avatar } from '@/components/ui/Avatar';

type Props = { id: number; name: string; role: string; photo: string | null };

/** A person from search; opens /person/<id>. */
export function PersonChip({ id, name, role, photo }: Props) {
  return (
    <Link className="person" to={`/person/${id}`}>
      <Avatar name={name} pfp={photo} size={40} />
      <span>
        <strong>{name}</strong>
        <small>{role}</small>
      </span>
    </Link>
  );
}
