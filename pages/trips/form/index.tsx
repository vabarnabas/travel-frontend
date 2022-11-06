import React, { Fragment, SyntheticEvent, useEffect, useState } from "react"
import { Combobox, Transition } from "@headlessui/react"
import Layout from "../../../components/layout"
import { City, Country, ICity, ICountry } from "country-state-city"
import { fetchData } from "../../../services/request"
import TokenService from "../../../services/token-service"
import { useRouter } from "next/router"
import Spinner from "../../../components/spinner"

const TripsForm = () => {
  const tokenservice = new TokenService()
  const router = useRouter()
  const [fetching, setFetching] = useState(false)
  const countries = Country.getAllCountries()
  const [selectedCountry, setSelectedCountry] = useState({} as ICountry)
  const cities = selectedCountry?.isoCode
    ? City.getCitiesOfCountry(selectedCountry.isoCode)
    : []
  const [selectedCity, setSelectedCity] = useState({} as ICity)

  const [countryQuery, setCountryQuery] = useState("")
  const [cityQuery, setCityQuery] = useState("")

  const [filteredCountries, setFilteredCountries] = useState<ICountry[]>([])
  const [filteredCities, setFilteredCities] = useState<ICity[]>([])

  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [rating, setRating] = useState<number>()

  useEffect(() => {
    setFilteredCountries(
      countryQuery === ""
        ? countries
        : countries.filter((country) =>
            country.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(countryQuery.toLowerCase().replace(/\s+/g, ""))
          )
    )
  }, [countryQuery])

  useEffect(() => {
    setFilteredCities(
      cities
        ? cityQuery === ""
          ? cities.filter(
              (city, idx) =>
                cities
                  .map((subCity) => {
                    return subCity.name
                  })
                  .indexOf(city.name) === idx
            )
          : cities
              .filter(
                (city, idx) =>
                  cities
                    .map((subCity) => {
                      return subCity.name
                    })
                    .indexOf(city.name) === idx
              )
              .filter((city) =>
                city.name
                  .toLowerCase()
                  .replace(/\s+/g, "")
                  .includes(cityQuery.toLowerCase().replace(/\s+/g, ""))
              )
        : []
    )
  }, [cityQuery])

  const selectCountry = (isoCode: string) => {
    setSelectedCountry(Country.getCountryByCode(isoCode) as ICountry)
  }

  const selectCity = (name: string) => {
    cities && setSelectedCity(cities.filter((city) => city.name == name)[0])
  }

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    setFetching(true)
    const token = await tokenservice.getToken()

    const user = await fetchData("GET", {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
      path: "auth/current",
      token,
    })

    if (user) {
      await fetchData("POST", {
        baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
        path: "travels",
        token,
        body: JSON.stringify({
          country: selectedCountry.isoCode,
          city: selectedCity.name,
          userId: user.id,
          rating,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          pros: [],
          cons: [],
        }),
      })
      router.push("/")
    } else {
      setFetching(false)
    }
  }

  return (
    <Layout>
      <div className="h-full w-full overflow-y-auto px-6 py-4">
        {fetching ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <form className="" action="">
            <p className="text-2xl font-semibold">Create a New Trip</p>
            <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
              <div className="relative w-full">
                <Combobox
                  value={selectedCountry}
                  onChange={(selected) =>
                    selectCountry(
                      typeof selected === "string"
                        ? selected
                        : selected["isoCode"]
                    )
                  }
                >
                  <div className="">
                    <p className="mb-1 pl-1 text-xs font-medium">Country</p>
                    <div className="relative flex items-center">
                      <p className="absolute left-3">{selectedCountry.flag}</p>
                      <Combobox.Input
                        placeholder="Search in countries..."
                        className="w-full rounded-md border py-1.5 pl-8 pr-3 text-sm outline-none"
                        displayValue={(country: ICountry) => country.name}
                        onChange={(event) =>
                          setCountryQuery(event.target.value)
                        }
                      />
                    </div>
                  </div>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setCountryQuery("")}
                  >
                    <Combobox.Options className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md border bg-white py-1 text-sm shadow-lg ring-black focus:outline-none sm:text-sm">
                      {filteredCountries.length === 0 && countryQuery !== "" ? (
                        <div className="relative cursor-default select-none py-1.5 px-4 text-slate-900">
                          Nothing found.
                        </div>
                      ) : (
                        filteredCountries.map((country) => (
                          <Combobox.Option
                            key={country.isoCode}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-1.5 px-3 ${
                                active
                                  ? "bg-sky-500 text-white"
                                  : "text-gray-900"
                              }`
                            }
                            value={country.isoCode}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {`${country.flag} ${country.name}`}
                                </span>
                                {selected ? (
                                  <span
                                    className={`absolute inset-y-0 left-0 flex items-center px-3 ${
                                      active ? "text-white" : "text-sky-500"
                                    }`}
                                  >
                                    {/* <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              /> */}
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </Transition>
                </Combobox>
              </div>
              <div className="relative w-full">
                <Combobox
                  disabled={cities && cities.length === 0}
                  value={selectedCity}
                  onChange={(selected) =>
                    selectCity(
                      typeof selected === "string" ? selected : selected["name"]
                    )
                  }
                >
                  <div className="">
                    <p className="mb-1 pl-1 text-xs font-medium">City</p>
                    <Combobox.Input
                      placeholder="Search in cities..."
                      className="w-full rounded-md border py-1.5 px-3 text-sm outline-none disabled:bg-slate-100"
                      displayValue={(city: ICity) => city.name}
                      onChange={(event) => setCityQuery(event.target.value)}
                    />
                  </div>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setCityQuery("")}
                  >
                    <Combobox.Options className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md border bg-white py-1 text-sm shadow-lg ring-black focus:outline-none sm:text-sm">
                      {filteredCities.length === 0 && cityQuery !== "" ? (
                        <div className="relative cursor-default select-none py-1.5 px-4 text-slate-900">
                          Nothing found.
                        </div>
                      ) : (
                        filteredCities.map((city) => (
                          <Combobox.Option
                            key={`${city.name} ${city.longitude} ${city.latitude} ${city.stateCode}`}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-1.5 px-3 ${
                                active
                                  ? "bg-sky-500 text-white"
                                  : "text-gray-900"
                              }`
                            }
                            value={city.name}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {`${city.name}`}
                                </span>
                                {selected ? (
                                  <span
                                    className={`absolute inset-y-0 left-0 flex items-center px-3 ${
                                      active ? "text-white" : "text-sky-500"
                                    }`}
                                  >
                                    {/* <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              /> */}
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </Transition>
                </Combobox>
              </div>
              <div className="">
                <p className="mb-1 pl-1 text-xs font-medium">Start Date</p>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border px-3 py-1.5 text-sm text-black outline-none"
                />
              </div>
              <div className="">
                <p className="mb-1 pl-1 text-xs font-medium">End Date</p>
                <input
                  disabled={!startDate}
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  type="date"
                  className="w-full rounded-md border px-3 py-1.5 text-sm text-black outline-none disabled:bg-slate-100"
                />
              </div>
              <div className="">
                <p className="mb-1 pl-1 text-xs font-medium">Rating</p>
                <input
                  min={1}
                  max={5}
                  value={rating}
                  onChange={(e) =>
                    setRating(
                      Math.min(Math.max(parseInt(e.target.value), 1), 5)
                    )
                  }
                  placeholder="Rating between 1 and 5"
                  type="number"
                  className="w-full rounded-md border px-3 py-1.5 text-sm text-black outline-none disabled:bg-slate-100"
                />
              </div>
              <button
                onClick={(e) => onSubmit(e)}
                className="mt-2 w-full rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 md:col-span-2"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  )
}

export default TripsForm
