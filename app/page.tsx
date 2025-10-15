import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, FolderKanban, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch dashboard stats
  const [{ count: totalClients }, { count: activeClients }, { count: totalProjects }, { count: activeProjects }] =
    await Promise.all([
      supabase.from("clients").select("*", { count: "exact", head: true }),
      supabase.from("clients").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "in-progress"),
    ])

  // Fetch recent projects with client info
  const { data: recentProjects } = await supabase
    .from("projects")
    .select(
      `
      id,
      name,
      status,
      deadline,
      clients (
        name,
        company
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(5)

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
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your agency's clients and projects</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients || 0}</div>
              <p className="text-xs text-muted-foreground">{activeClients || 0} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects || 0}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects || 0}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalProjects ? Math.round(((totalProjects - (activeProjects || 0)) / totalProjects) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Projects completed</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Latest projects across all clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects && recentProjects.length > 0 ? (
                recentProjects.map((project: any) => (
                  <div key={project.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium leading-none">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.clients?.company || project.clients?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
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
                      {project.deadline && (
                        <span className="text-sm text-muted-foreground">
                          Due: {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No projects yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
