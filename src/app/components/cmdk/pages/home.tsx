import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { FilePlus, Moon, Search, Settings, Sun } from "react-feather"
import { CmdKPage } from ".."
import Item from "../item"
import { CommandGroup } from "@components/cmdk/cmdk"

export default function HomePage({
	setOpen,
	setPage
}: {
	setOpen: (open: boolean) => void
	setPage: (page: CmdKPage) => void
}) {
	const router = useRouter()
	const { setTheme, resolvedTheme } = useTheme()
	return (
		<>
			<CommandGroup heading="Posts">
				<Item
					shortcut="R P"
					onSelect={() => {
						setPage("posts")
					}}
					icon={<Search />}
				>
					Your Recent Posts
				</Item>
				<Item
					shortcut="N P"
					onSelect={() => {
						router.push("/new")
						setOpen(false)
					}}
					icon={<FilePlus />}
				>
					New Post
				</Item>
			</CommandGroup>
			<CommandGroup heading="Settings">
				<Item
					shortcut="T"
					onSelect={() => {
						setTheme(resolvedTheme === "dark" ? "light" : "dark")
					}}
					icon={resolvedTheme === "dark" ? <Sun /> : <Moon />}
				>
					Toggle Theme
				</Item>
				<Item
					shortcut="S"
					onSelect={() => {
						router.push("/settings")
						setOpen(false)
					}}
					icon={<Settings />}
				>
					Go to Settings
				</Item>
			</CommandGroup>
		</>
	)
}
