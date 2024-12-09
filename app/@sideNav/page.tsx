"use client"

import { useAppSelector, useAppDispatch } from "@/app/_src/redux/hooks"
import { mapActions } from "@/app/_src/redux/features/quiz/map/mapSlice"
import { statsActions } from "@/app/_src/redux/features/quiz/stats/statsSlice"
import { recordActions } from "@/app/_src/redux/features/quiz/record/recordSlice"
import { BsChevronDoubleDown } from "react-icons/bs"
import "./side-nav.css"

const SideNav: React.FC = () => {
  const map = useAppSelector((state) => state.mapReducer)
  const isRecording = useAppSelector((state) => state.recordReducer.isRecording)
  const { userAnswers } = useAppSelector((state) => state.statsReducer)
  const dispatch = useAppDispatch()
  const start = (): void => {
    dispatch(statsActions.reset())
    dispatch(mapActions.change("category"))
  }
  const restart = (): void => {
    // warn the user for losing progress when restarting
    if (Boolean(...userAnswers)) {
      const isConfirmed = confirm("You will lose your progress!")
      if (isConfirmed) {
        dispatch(statsActions.reset())
        dispatch(mapActions.change("category"))
      } else return
    }
    dispatch(statsActions.reset())
    dispatch(mapActions.change("category"))
  }

  // click handler for Record, About and Exit buttons.
  const navigate = (
    to: Omit<ReturnType<typeof mapActions.change>, "type">["payload"]
  ): void => {
    dispatch(mapActions.change(to))
  }

  return (
    <>
      {/* the toggle for side nav */}
      <div
        className="nav-icon w-fit h-fit absolute z-20 inset-y-0 m-auto sm:hidden has-[input:checked]:rotate-180 transition-transform hover:animate-none hover:translate-x-2"
        title="side navigation"
      >
        <input
          type="checkbox"
          name="nav-toggle"
          id="nav-toggle"
          className="hidden"
        />
        <label htmlFor="nav-toggle">
          <BsChevronDoubleDown className="-rotate-90 text-teal-500 hover:text-teal-400 opacity-80 scale-[5] cursor-pointer" />
        </label>
      </div>

      {/* the actual nav */}
      <nav className="flex flex-col justify-evenly h-screen w-48 bg-gray-900 ml-12 text-white absolute z-10 -left-60 sm:left-0 transition-[inset-inline] sm:static">
        {/* logo */}
        <div className="h-40 bg-orange-300"></div>
        {/* buttons */}
        <div className="flex flex-col justify-center gap-y-5">
          {/* start */}
          <button
            className="nav-btn"
            disabled={
              map === "category" ||
              map === "settings" ||
              map === "session" ||
              map === "result"
                ? true
                : false
            }
            onClick={start}
          >
            Start
          </button>

          {/* restart */}
          <button
            className="nav-btn"
            disabled={
              map === "main" || map === "record" || map === "about"
                ? true
                : false
            }
            onClick={restart}
          >
            Restart
          </button>

          {/* record */}
          <div className="nav-btn flex relative z-10">
            <button className="w-full" onClick={() => navigate("record")}>
              Record
            </button>
            <input
              type="checkbox"
              checked={isRecording}
              className="scale-125 accent-blue-600"
              onChange={(e) =>
                dispatch(recordActions.setIsRecording(e.currentTarget.checked))
              }
            />
            <div className="hidden w-72 h-20  bg-orange-400 absolute -right-80 m-0">
              <span className="h-4 block text-end pe-2 m-0">x</span>
              in order to keep your quiz history, keep this checked.
            </div>
          </div>

          {/* about */}
          <button className="nav-btn" onClick={() => navigate("about")}>
            About
          </button>

          {/* exit */}
          <button className="nav-btn" onClick={() => navigate("main")}>
            Exit
          </button>
        </div>
      </nav>
    </>
  )
}

export default SideNav