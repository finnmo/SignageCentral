
const Footer: React.FunctionComponent = () => {

return (
<footer
className="flex items-center justify-between p-4 bg-white border-t dark:bg-darker dark:border-primary-darker"
>
<div>Digital Signage Manager</div>
<div>
    Made by
    <a href="https://github.com/finnmo" target="_blank" className="text-blue-500 hover:underline"
    >Finn Morris
    </a>
</div>
</footer>
)
}

export default Footer
