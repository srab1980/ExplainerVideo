// GitHub sync utility for StoryVid projects

interface ProjectData {
  id: string
  title: string
  scenes: any[]
  createdAt: string
  updatedAt: string
}

export async function syncToGitHub(projectData: ProjectData) {
  const token = localStorage.getItem('github-token')
  const repo = localStorage.getItem('github-repo') || 'storyvid-projects'

  if (!token) {
    // Prompt for GitHub token if not exists
    const newToken = prompt('Enter your GitHub Personal Access Token:')
    if (newToken) {
      localStorage.setItem('github-token', newToken)
      return await syncToGitHub(projectData)
    }
    return false
  }

  try {
    // Create or update file in GitHub repository
    const fileName = `storyboard-${Date.now().toISOString().split('T')[0]}.json`
    const content = JSON.stringify({
      ...projectData,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    }, null, 2)

    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${fileName}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Update storyboard ${projectData.title}`,
        content: btoa(content),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to sync to GitHub')
    }

    const result = await response.json()
    console.log('Successfully synced to GitHub:', result.sha)
    return true
  } catch (error) {
    console.error('GitHub sync error:', error)
    return false
  }
}

export function setupGitHubConfig(repo: string, token: string) {
  localStorage.setItem('github-repo', repo)
  localStorage.setItem('github-token', token)
}

export function getGitHubConfig() {
  return {
    token: localStorage.getItem('github-token'),
    repo: localStorage.getItem('github-repo'),
  }
}