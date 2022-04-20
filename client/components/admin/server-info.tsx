import SettingsGroup from "@components/settings-group"
import { Button, Input, Spacer, Textarea, useToasts } from "@geist-ui/core"
import { useEffect, useState } from "react"
import { adminFetcher } from "."

const Homepage = () => {
	const [description, setDescription] = useState<string>("")
	const [title, setTitle] = useState<string>("")
	const { setToast } = useToasts()
	useEffect(() => {
		const fetchServerInfo = async () => {
			const res = await adminFetcher("/server-info")
			const data = await res.json()
			setDescription(data.welcomeMessage)
			setTitle(data.welcomeTitle)
		}
		fetchServerInfo()
	}, [])

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const res = await adminFetcher("/server-info", {
			method: "PUT",
			body: {
				description,
				title
			}
		})

		if (res.status === 200) {
			setToast({
				type: "success",
				text: "Server info updated"
			})
			setDescription(description)
			setTitle(title)
		} else {
			setToast({
				text: "Something went wrong",
				type: "error"
			})
		}
	}

	return (
		<SettingsGroup title="Homepage">
			<form onSubmit={onSubmit}>
				<div>
					<label htmlFor="title">Title</label>
					<Input
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<Spacer height={1} />
				<div>
					<label htmlFor="message">Description (markdown)</label>
					<Textarea
						width={"100%"}
						height={10}
						id="message"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>
				<Spacer height={1} />
				<Button htmlType="submit">Update</Button>
			</form>
		</SettingsGroup>
	)
}

export default Homepage
