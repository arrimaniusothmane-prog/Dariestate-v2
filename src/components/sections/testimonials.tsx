import Image from "next/image";

const reviews = [
  {
    name: "Youssef Amrani",
    city: "Casablanca",
    text: "Visite organisée à Bouskoura le jour convenu, dossier clair et prix affiché. J’ai su à qui je parlais.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face",
  },
  {
    name: "Fatima Zahra El Idrissi",
    city: "Rabat",
    text: "Mon appartement a été relu avant publication. Les demandes qui arrivent correspondent vraiment au bien.",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face",
  },
  {
    name: "Mohamed Benali",
    city: "Marrakech",
    text: "L’accompagnement jusqu’au notaire m’a évité de courir après les documents. Réponse le lendemain.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
  },
];

export function Testimonials() {
  return (
    <section id="avis" className="scroll-mt-24 bg-card py-20 md:py-28">
      <div className="mx-auto max-w-[1760px] px-6 md:px-10">
        <h2 className="text-heading font-semibold tracking-tight text-hof">Avis de nos clients</h2>
        <p className="mt-3 max-w-xl text-sm text-foggy">
          Ils ont visité, acheté ou confié un bien avec DarEstate.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <figure key={review.name} className="rounded-2xl border border-line bg-background p-6">
              <blockquote className="text-sm leading-relaxed text-hof">“{review.text}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <Image
                  src={review.photo}
                  alt={review.name}
                  width={44}
                  height={44}
                  className="size-11 rounded-full object-cover"
                />
                <span>
                  <span className="block text-sm font-semibold text-hof">{review.name}</span>
                  <span className="block text-xs text-foggy">{review.city}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
