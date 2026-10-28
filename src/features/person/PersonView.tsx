import { Filmography } from './Filmography';
import { KnownForRow } from './KnownForRow';
import { PersonHero } from './PersonHero';
import { usePerson } from './usePerson';

export function PersonView({ personId }: { personId: number }) {
  const p = usePerson(personId);

  if (p.loading) return <p className="pe-state" role="status">Loading…</p>;
  if (p.error || !p.profile) {
    return (
      <div className="pe-state" role="alert">
        Could not load this person.
        <div><button type="button" className="pill" onClick={p.refetch}>Try again</button></div>
      </div>
    );
  }

  const kicker = p.departments.slice(0, 3).map((d) => d.name).join(' · ');
  return (
    <>
      <PersonHero profile={p.profile} kicker={kicker || (p.profile.knownForDepartment ?? '')} stats={p.stats} />
      <KnownForRow items={p.known} library={p.library} />
      <Filmography p={p} />
    </>
  );
}
