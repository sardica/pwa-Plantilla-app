import { useAuth } from '../hooks/useAuth'

function ProfilePage () {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>
      <pre className="bg-zinc-800 p-4 rounded-md my-2 text-white">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  )
}

export default ProfilePage
