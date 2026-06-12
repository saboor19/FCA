
export default function FeeCard({

  title,

  value,

  icon:Icon,

  color = "",

  textColor = ""

}){

  return(

    <div
      className="
        bg-card
        border
        border-border-custom
        rounded-2xl
        p-6
        shadow-sm
      "
    >

      <div className="flex items-center gap-4">

        {/* ICON */}

        <div
          className={`
            h-14
            w-14
            rounded-2xl
            flex
            items-center
            justify-center
            shrink-0
            ${color}
          `}
        >

          <Icon size={24} />

        </div>

        {/* CONTENT */}

        <div className="min-w-0">

          <p
            className="
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >

            {title}

          </p>

          <h3
            className={`
              text-2xl
              font-bold
              mt-1
              truncate
              ${textColor}
            `}
          >

            ₹{value}

          </h3>

        </div>

      </div>

    </div>

  );

}

