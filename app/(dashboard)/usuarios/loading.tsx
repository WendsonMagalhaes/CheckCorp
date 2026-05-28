export default function LoadingUsersPage() {

    return (
        <div className="
            flex
            flex-col
            gap-6
        ">
            <div className="
                h-10
                w-64
                rounded-2xl
                bg-muted
                animate-pulse
            " />

            <div className="
                h-[500px]
                rounded-3xl
                bg-card
                border
                border-border
                animate-pulse
            " />
        </div>
    )
}