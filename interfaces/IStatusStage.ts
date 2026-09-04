export interface IStatusStage {
	label: string
	status: string
	completed: boolean
	cancelled?: boolean
	disabled?: boolean
}
