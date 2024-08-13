import { createFileRoute } from '@tanstack/react-router'
import Input from './input.mdx'

export const Route = createFileRoute('/input')({
  component: () => <Input />,
})
