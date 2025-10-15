import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { AddClientDialog } from "@/components/add-client-dialog"

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from("clients")
    .select(
      `
      *,
      projects (count)
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Agency CRM</h1>
            </div>
            <nav className="flex gap-4">
              <Link href="/">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/clients">
                <Button variant="ghost">Clients</Button>
              </Link>
              <Link href="/projects">
                <Button variant="ghost">Projects</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
            <p className="text-muted-foreground">Manage your agency's client relationships</p>
          </div>
          <AddClientDialog />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients && clients.length > 0 ? (
            clients.map((client: any) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      {client.company && <CardDescription>{client.company}</CardDescription>}
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        client.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium">
                      {client.projects?.[0]?.count || 0} {client.projects?.[0]?.count === 1 ? "project" : "projects"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No clients yet</p>
                <AddClientDialog />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
