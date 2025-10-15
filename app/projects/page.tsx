import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { AddProjectDialog } from "@/components/add-project-dialog"

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from("projects")
    .select(
      `
      *,
      clients (
        name,
        company
      )
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
            <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
            <p className="text-muted-foreground">Track and manage all your agency projects</p>
          </div>
          <AddProjectDialog />
        </div>

        <div className="grid gap-6">
          {projects && projects.length > 0 ? (
            projects.map((project: any) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">{project.name}</CardTitle>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            project.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : project.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <CardDescription>
                        {project.clients?.company || project.clients?.name || "No client"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}
                    <div className="flex flex-wrap gap-6">
                      {project.budget && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">${Number(project.budget).toLocaleString()}</span>
                        </div>
                      )}
                      {project.deadline && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No projects yet</p>
                <AddProjectDialog />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
