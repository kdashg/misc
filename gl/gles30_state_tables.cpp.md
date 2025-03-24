# OpenGL ES 3.0 (GLES30) Object State Tables as C++

Spec PDF: [GL ES 3.0.6 (November 1, 2019)](https://registry.khronos.org/OpenGL/specs/es/3.0/es_spec_3.0.pdf)

Godbolt with no errors: `x86-64 gcc 14.2` `-std=c++20`: [https://godbolt.org/z/cbYEb939G](https://godbolt.org/z/cbYEb939G)

*(Full Godbolt URL embed: [https://godbolt.org/#z:OYLghAFBqd[...]](https://godbolt.org/#z:OYLghAFBqd5QCxAYwPYBMCmBRdBLAF1QCcAaPECAMzwBtMA7AQwFtMQByARg9KtQYEAysib0QXACx8BBAKoBnTAAUAHpwAMvAFYTStJg1DIApACYAQuYukl9ZATwDKjdAGFUtAK4sGEgJykrgAyeAyYAHI%2BAEaYxCAAbKQADqgKhE4MHt6%2BASlpGQKh4VEssfFJdpgOmUIETMQE2T5%2BXIFVNQJ1DQTFkTFxibb1jc25bcM9faXliQCUtqhexMjsHAD06%2BYAzGBgANTIyPsAtAoE6CbbACKmltZmGiYaAILPL5v7AOLB%2B9hC%2B22ADoNECEvsIBFUAA3TBlOL7LikfaPNpzEDvT4IAgEZIKECbYiYYB4c7EACeQIA1ghiAI0kCSMB1gB5ZKMH7rBTs5AKdaYPnAjT8hQAfW51VFQqByXQVHeCrM2zCyG8WH2VzcvIuYQIV2wiuVDFVXnVmoaxCY5P1hpVaswGu2bjJYWANteOztpodmthDhI7rer0%2BABVyeyFArXl50kZ9l5dY7rvHddszKK9dsLPtPuYzAAtax594x137ZIEYhJ/a6ivEDNXbO5sxmACaxejseA8fSAC8fTd9n3MA2szn1hqW4X7i39gB3QgIGsJST7YCYHFxIElrvxqi0VBMAjV/eHzNNid5gBKRdnEBtg9BGioc3eBDhyQM781CcE%2B2UaTpNEdAZAKVzXBoyLRKgnj7CyxAALIkJg4FUGISj6j2ZY/IwPjVr%2BBBpqOVgesGE4QNgTDpAiRD7ESTDoPsFpWvsBDhgKTEKPsESkCGNYMOcmAMfsqBUPsIakBEr6vO%2BLCfkeKFOgR3HIqqVFcSGmGlnGFrVuc6AgCAzHWk6EkRA%2BJEvNp3b6YZfpEMQjY7mWtkgC6RhOZ2ZbROS75ceB%2Bz2QGTquT537bAaWZRh8E4nNFakKFxFheFQVBxJ5LwJVxABilpsNEKVpY5UWvFl/50sAeUZWVACKXhxCZlllVerhxAVqXpSVmUGIl%2BxCKwn6dU1PVcUICAMUN7xlUI5LGtVI3iZgqgEMsinDep4mWgJ/DECw2WYJg6DREwyBUvNG0AGpxO%2BqgvMQlqNdFsnyeFWoLZpEVYXGeCMQFBEZZiE7YMtcQCUxDCMR4Ak3ckxCRqRLxLe%2BxAMPxx4AOoAJIRNcLLo6KWPXCGAASGVI6DaP7FjON46KxPYJjXzEx9lnkyj3zBLhLCaphFgvG4ADSZMg%2BzOEMD4POfW4bjo8LyOo2LEtOphuMRCGopuC8V6RazIsK5z4vc8rn0htgAAaIZyNrTxdWz%2Btc5L2D7C8wToy8rZCHLFOK0bbiYQL2DYMoXuiwbSt%2B59wT/J7tt6xzDvG07LIRDr7x2/HhuO/s%2BbYFeLIh/bmeJ/s2VyBEbiii81zXAXGfh5hQghi8IaYxX1xXi8sux/Lde%2B5hV5fHzki1z7Wcp1r/zqwhmPKAhLzKKKwTY9gWsj2HfeR8vq/d9769Z9rygryzadx6PxdRzVcgu2vCcR07QituXorZdg5ep686dn3f%2Bxl0IjMRC7bANcd6h1vg3R%2BFcvjKDkBrFkCE544yELAhCygo6mxvkXb%2B2tgG6x7l/TCXxtavwwfXT6FhghyHfojU%2Be9i4u2UMTN4IDC6kKdtlYILJm4kI3k7bGpsrxRxeBdIBlcQwhivJjCwMdLKA0/rQ7%2BbgWQcKvKIpubhiYIVfiGG2llNhyLAZ9CIycqFoGhktWGvcs6KOUao/mGitEaGrBoVQAAONw2AdFTQEIJVQFj8GGOMU4gGZF9iYzkvQNgggjyZFCCwQg8MgwvDJF4BwoTwlwkYPURwRQ8BxIIP5AA7JZfYJTPjJDMAU7YIBxJMGiPQfYCQgRmBcdUsJg1IlZMyPsa4mB2QQ0yfsC6Yh6oJJKVhfs%2Bw55m1FNgKOmi1aimxtcc21YIBcEdBHNwKJJBzFOIiDKYzlJCDkBYZQmMzazNFBYTGIYAQBWHl1Q5iYplSmuKKU2FsrbYFFH/HO1YzAAFYEgHJKcpF5HzLbax%2BZjP5AVHiSBcSClMf4Xlaw7q2d55tIXfOCO7XOdzByAuBY80Fp4jyTJeNMiFXzF4sjedcl4BLkxmBBEisFlKNYnO%2BXPBe1KoW/KdnCjQCK2XPI5drHGucLByGyi/FRAr/nCsRSS5Fx4Xnt07lcmVcqmX7AecU0FYrpnWJZCo5uaj7Fq11fq94YyLSajMMif6n0XkXUxtgdGyhTXq2uJjBC0jbUlPtU6R1e4DxHkwi7TGjKRFer4dCnOooO4RC%2BIKwcJgilIn2QUnBgamL3QdU6slmYnZRpjW8peKcCaYyJsTJNLwU1puTBmiwWauAZtzQjMZZSKmSGqSGWp9TGlmH8K09JHTokCG6b01qf4hneA4hAUxBAgTSReE8lFHLZnYHmbcxZONW7/CCSq9l0zt27qQcIq8Ld3G6s8a8MZQVipuH8ZFJ2iiUHayEEIERfLvnZVNXPW5SKn2alfZhZQedCEvAQlc7GWsMUAavEBgND6SmgadOBz6QhGHLJUdcgBV5EOAebqh9dJToKwRw1XXOyCzlRyvNWSs9VgnkaHMx1Jyg4hjQmsQZQRJkCkkyNlEgLByUtrzXagtIanW6kwltdcSKN3HlhtUITAgkUdqRcGtwZgABU%2BntjIi48QHjWA%2BMCfUwwETu0I2fQUONcz/G1PpAEDZsT%2BTWOHOHBS6ZP6rxXoJi8G57y/XYBZHIPiAV72JO7ROcpBSAX9sHQ6Rp2wNBjvaZkydqMel9KwHOuIrnUaGEYsDd8AkulCC8MkVIjQ80YedJWV0mEsWvz/snMjymKUAClTWiivR1iI1ZtiipRdjfrg3MbJ2PQa9jxAywSrw7nJF7luzUbw4vBtXwr6poG/i6b5kVVrcGa/XGN5jvNbjFN5OXnSnxYqQkZLdTUtAm2FwTLETsvZNyzO/phXGhLT6o5hEsT4l5tPft695tVESKkdWLgxK5uQ6vR80UZdMZIdgx%2Br1KcrUI40GYG1aHVW%2Bah2jjHWP9tuBDKa3VRKxtqo5ajmHlPANXI4YLXVXAzCM7Jyz6ZEWQzQPVjj4x%2BOAorj5663OaO/2LLnntjHtyEdI%2BinF8sFSCnPaHW9swn2MlRJ%2B9O/LAzcpMGAB04HvH9hg88yTyH2UO5fF3ejiImP2di7xyrgKLj/Bq4d0a5%2BzvXds%2BQ9T2nV56dE%2Blxyp3LwXdaLdx78P5CWRc4R7zk9Qf4%2BJ4WdjEXdHxc%2B8HAkGL3XwVYppX6hP3zlfc4D2x552NRSQZZNB2DHzLksllT%2BqLg4TjKrm0HtvHfMUXOCKKHv2U%2B/VgKXd8cmuCktJqS9hpb2qlpKy0brpeXZ3HheMASqxIFLW/M7b3J4PA%2BbumWH2D0rZW0YI76lN9PidsdLBMl5d%2BOfp4FgmptREBIbYFxd/brH/B/OVKfXvbAdWKNL4CIXdf5IFWPY1OBAjERCAznAWN/JFUxHxCxT/B0F5D9DAt5AXZPKnL3LRIQCAXZfA48CTEnMZIkFadmGXaHW/d3KnNPDPPTMnLAv/AAnMPVSTMZScbMDginbgz3OBXHGgzTHNPNBg8xKsIgsnUg5eN5XPUPGQ8Pagq1Ogw4bxRgopMQuiDcZYVGF5HQpPQQvggQvQ%2B/bA4QicYeZgkpawMnWwhZH/Aw4DFVLTa/JnaZC6BDbGL4Ivb3XVMvVAgbcIlNCPOnBHAFOIzQlON5eXGvJXd3EvZMNMBfHtApUdVfXXbYPtLfL7HfKdPff7Y8EMLaBQHaFgEuA6I6E6KkC/PJfECHIPcRBtIQKnF%2BIBPmQWfdfhQRYRN5fwmIsAw1G/d5ZNQY9nYY64UY//H9ZQLWZub5c1OHa1OI/oiIZY8PVY9Yn5IObY02KImg6sd/PNHtFxD7Uo17bYJ7SZUkVYWgAwcIJYUZINaTNwIzGsS4J0OqBqB8d9K2CVdWS%2BXOVsasFtJ4JQlVH6TUZKDqYqd9FkZQDFbWKuLVR/fDJZCI2bPNNEp0DEoqTCRRXEgmCRa4yAp/EklNMkrte7SovAQ6DEB3HzUUF5RuV%2BNwTGSfa5PI/YIfBUFEyyc4aJY4FQ3xKsJgLwWiJeaecUtpKozpHJboiTaU6KT4KGG6YQLJFCBGZJVJI0pGbod8DUMwknHtBFHXV46pK6QHVQZ2e6Fia4I8JgCEBgVAY8MIQKa6IHYyESaIbQaofJNdMZCktwKkzqUtK8dFQkqA5/Uk6LJFeMt0m6O6B6TCCgtFd2ODA9FNJFSjWgf8CRdUzGYRJNSeLWdWbKc5ERJZFZAKNCWgDCLqB4h7AFDLF49fJLTaQwJo0THLPqU0vNHTaQNGQs91T1b1REopSCfYNc6mXGfGQmEmZETc2memRmZmLTFVHTUNFKcNEtbpIOEmetRtFciwNc9tfUkneMhosc5o/aQ6Y6U6TCI4k42DM4/mf/DM1krM3sh0/s54gdNfRpd4q8KiZGPAXsHLPNSs/YDuQUiRHOFRX1IQTWK8ZtQcLsns5HYtW3ZeatWtBHVlFVdCtwOQYISfbKfmQAkitaPNL%2BUbKWRi5i1i/kulQA9YpFL%2BLPNhPOBZFi9xasaWLuObcir1YIVsL4ZOaAmfWA5%2BfmSPNktjBSpRZS1S6fPvZPcU8vCjGCKsxSgyiINS4ylspik8dCDi9kxfcpAFfXIcxpbXSZLwWgRwBQAaWgFrEndCoQGDVBXY4IBhF4d5FkWBK9WvRy7s5ytjUK8KqOeK3ORKzspytlcisKlBDKxRBKvbMIihQArgEEeUOiiyvqdK75YqrKvbbGVHJK0i9XDktyzfGC3XFfEMJGVaLiCADoByZEWU209kKsY01aeMBgQgWMkpLix1ZjRSUtGnOs75P9asP9My/NZ9NUm5IQIEEg9ArQ8fbFBXWvEyoQZEN8gaokSE8SKvKFUCyIswIi5tVck8ubHTA625Y6jldI39Z675bIuvXIm6kEzUfq5aVaR6%2BXV615B85EztNjX6v1Q6gGtAhCMg866vRXcGw6260Emne61av8kG0sl/N6t5YshEgKJE76mcwEv6o6k6nGs6rIgm664m6Gsm%2BGymxGhiiwbleeZGpmkndG9UtmwG06jIvGqFMGnmqGp0fqdJLEhueq4kssr4cWl82LTqolZ09fLgZ45QPAVQTAKstkOIHLf4/YUK4U79frU2RuNqlKqTZ9OcuTbDJ2oQfrCwFkM2ZG5EDcpZWmHc4mPc8O/GQ8pmTSfWsZUK02cuEUzFN2nK5KkS%2BRZVe%2BFO4U5isuLZAKF2N2D2PnQU1OyfMqyhfkxlAWVZdZSWLZVmoEOuvzfOtOsUoQOYE4dtbPP8Suguhs7KHSsZL%2BXOvqTuvikU6sAOIObO2%2BSeoetOrY79UUZZZQW8li2egKee4OFVCehuae1vRlJBTe28te3VfexezBZek%2B840ucuasUu92LreY48Fe0U4C%2BI8quuoQBugKNZDZTUCi6WtugUh%2Bw63u/u5HRML%2Bq5H%2B7WUe8CubI%2B7DB%2Bn%2Bne34PewOA%2BtBnO4%2BoUrurB4LSfK%2Bjem8utbBuevB2%2B8Oe%2B4h7%2BsY7B0%2B9ei%2ButK%2B2hhemq2CDh9O/vZMdi%2Bh32Se/hp%2B4uwcKOb9Cs2q8hM7d2kRzUNoXmKOHGH5K8CuAebMAKYxJRp0FRshNRt5IQTRyuKKxhasPRw%2B%2BRQxp2eR9R64RuJNQeasHC/OGx2%2BOx/YBxt5JxuAix9dAKdx/RtwVIoxs7GZS%2BZuQ7FxnRwcCRyuauUJ8J%2Bx4xqJq%2BFuVS%2BhSxgKRJquVGz2zUOc4tVRyJk1RjBm1c0gSCWpiW1K2q31EmXOJjYgFjCCtjHtAFbynq17Hnapc3fKQqBEI0ukWgZmr2qCCymkpRfrdGBkndeuh8la5EFZ1iNpzAVZjZ%2BppOxpw%2BW8%2BZm5RZgB1p9puBwek%2Bw502OeE5gKAAP12qOUwbGKueOcAcHAee00BJKcvJmZsTcEERURrsAKRJqbBZRrysvOvK3rrQBZXiBZdkoRosefgZPrha1l/qRdQfJJJsGcwHampM%2Bg1Xxnj00SZO1uprHpKXjLxYJaTIwpXm0I7jJe1WZJ1qpZVrcBan6WIDpaxIZclSvHJapszMfEKIewSGgpSxNvePNstu7N6L/DLi2LGKVrjuZg5eUmVZ/oAZnkutTTvT521bGLznxjUa%2BBJk1cTGNY2IFj1dNcNYHuPBtZ%2BTtYXjOQn0dfOedYiBVf/3gMQK0Stb/D9aTVpnNctexeCP/B1bdbDfRi9cVePFDd1fddbOCETejdDYDaQKjabxJsTP5Y9cuVDeFdeo5fjMLYg3Tbd1LdZYpdFeTBiz7M12AONsaS4BX341QEqlYDgkjOjKnIUhxc1G7d7aNihJTKT1H2ZZ0pbfKQSB6eleHQ8tzKBzMwRBtIdAgADJUx6BEjElhh7bygjKjIcAUAWr2s1FbqkJhz2MkUhtnORFKYihpOhKTyLLEThwfNBdqdIGfJrn1vnbMASBKN6fXyJ37UaOaNaO/I6KHe/FfILeGf5f/KGMDjWJ/rLZZN1rzeA4KUHPA%2BHRHLkDmpg8LZ8bCHwDjC3ZHcpJQ8wggPrZFbArFY6bGQtOTbiFI7wGaIo6YLYzjOQ8xMY6cLTLZcpbzfENBR8yY6JJ%2BSbmvQ5e82QodDk6gIVSk88MToBP2oxv%2Bu/zE%2Bw51shpMx4744Y8%2Bi8DI9E0LcjHY8NoKQ8qI6aW8uJl1Htq4oIVfiyuuOnlnnnjpj4WrFVlFwnlCe4vEoT1dw21ozwzrJifrOJmC4ClC41nC97KA5CULdo/NI42PBy9NLtLm0dLA%2BXaBAqIo5ZAHdSVy4/x82Fc07Y4Idvn8F5mY7kDCtTWrEbhibbg7jkqTZ8eY/5lvSQXYQT0zYadgmFZ5UPg%2Bv2GEZVTrGG/k55VbxZD4Raa0/GQdFm8C6MtgM1Ya%2BY/W4jeJjnay5ihLjynxZQ7q/eE45u9YDu8xK3eK%2BA4BT6vK64E31pZQ4hHGodEmsW9u75dPejMvalsxvVQG/E6j2RC/lNtIBWseuJfh7wAfIqdsXUV3TXMcR2cWtsaRFR8%2BnxPpXrcbEX3BIW0OlB9QBaPJ%2BDxg2wHJY6tcsBTK9gqBCkAGbB4B%2BGqK5B6PHqGQAQCt1SF1Evae5MxeBxBOnF4GQE%2Bk8sSdAeSi5Zfk/NTsVdxZAsB62wBp3eVbEPmrCMRTiU1BTmqnWV5V85e5fMz5fk2iGU/ELuthoes%2Bhukt7tOTFJdZ5G7ER16Tz14N6N4AU0R/Z0/EOUn9%2BFe19x6T3lyjmERwea/MNj%2BZYD616D8T4WXl2FtFoXiksAPN6oRV8TDj8D4tVd2T7xUqea8X2wC9PqGqWdWynMNEswir5z5r6T2x6FLpQiJ96/nV5Liz/j9z8tVFzkOL2N8Ph98z5Z8n774WWwQAMX8r4n%2Br%2BD4WUIUDhsoFU37/B76gIT%2Bn451rqP5VW61P9o3P9dxyZiuv7m1v%2B3979359SoY35v4/vH%2BX535591YCDF/nmkJ5XsnQN7WWjYgf40FjMcQOXqL0V6CBMIIvBXh0ns4yJIKmuFxIR3K7bARy/3TEibn3yDJhkYEaNgVQirw8pu3WKgdI2DYhEfk9VA4k6wZb0pDqfOffq/DgwBFvWPjP%2Bt3T5xP9eB79UnPwyEFsCEGkglrpgkwh%2BoIqu6GJqpWx5M8QwJvHWNT3qi09GIVAOkIz0ZbM9NecqbcCTlfShJCqO6LRMoJsqqDDBWOLhGOE%2BA08uSug/QQywJJ38rwpgt4Fd3Gp4BkAoodSNdAgBECiotHMwjmiBDo9yWeAEwACkfLxCPqAUbHrALVgaBXwXUfwYEOCGNBQh/PN7tOUiHXBohcPWIfENbRJCkw0WTITKU6Q5DEoIQsIdxiKFWAohMQ%2BtnEISG84AUyQx8LUINITgx2eUB7q8Bl4VQRhRXW3hzzbaeUeeXbCYX22q5ntP605EKo023TXFeulsXVEtzmzoVK0GxJuDsMUa8MqyZVGtDsQU7NxOupwubI1njIbsNan0c/iIli5R4o%2BhTEpCdmxgAZaUuHdNC2GLAOd5sKSLjsQEyiOBYQ5nUTB9w8KUwDwogH7Mf2PDDgR%2B8iTCGxHZA%2B8TszANgD7x7QJARyLnR4NUmGFLCauqw0/EulkCrpO%2B8iCpKJxTyd4NBKIn%2BGJ1AHwjrWRnFwu2TNg%2B9uRzI2yrAQJESt3iJIs2osJaLLDB273GkYIDpFcilWYnOmgpwkTLIBRyooUUBgkQd11R5faTuhR/yYwkEprOun1guxzZwBjWWXjUGhE2ddokadavWTvy6o9SXw8cDaIQF2jMAiAhbAVHChrUW49Ze9tKldqfCqenwJCLCEYixADwc4Hwbs1ggzsYMpZBDA2XETuowi8jILmrDuFoVfIHEFMffngxEYIxIIwkRURc5tAyRUo/tisIQ7btl0iotjDL29FQjfROIf0SqR9D2lBO1LP8IiNQq/9ScaIkceYKxEe1pOuIl7ooQ9FeiIRPov0XgADGrVnYzo3Yl%2B0kSRYj0VTNoTgkXyQivAYgWgOSFbbAh2eXfE2EsXQ4jEsOp3QStWC24CIV4UxWHA%2B1Wz5d/w7YvALCBDBUAhkFIMsNMO6xjjX%2BRPAxE7EnE4irs3YPEVON94gZoywUNwLaI7H/jAJ5IFrNeIGK3jMOYxMIkRgiJujih4rVtsSPK6kjyox7CkQ2LlHNjL2mwBcZCN/GYAYRu0CwIiLOgvCNxlBdnLwRwLliLwkyGEHTzjGoAExeaNsYuI7HsSWAnE1AKdDhH9iZh4oyiZKJonSjKRjYiEAxIz6CieCLhctjt3AI8ihC1wZuM/xhQGjxCjWZ1E7HsL%2BteJxog9Leh95GizJJrbAHKiFIiILAGKCgu8PzHwiPJQogSSPVzi%2BT6UiGEPEniCmZ12qJOa0chOfRoTWJckhSb%2BR4nBjCahkv/CRP3GRiJwR4k8WeIXYAofB9TQGPsBp7khRhSSL8bVPe7TDCR33bnkqGqS1T6xsotYR/kTBwkiMDZY5MEEEbrlZGsEAaXiX%2BCMU4CYREUi8HkbBTfBqNaqQ7zaj3depj3L8WtN5YbTT8LUiVngO55cARyO08HoL1Pwg8iQPLcHqgEpGXtlIS2KVMx0jqMCBWeGYVuq1Gm7VR%2BkXd6c9Pk7PiAEzFEjKNO0YvA5ipOJ6UK2Y7r8muTbPnNDOFbcDD%2B1kt6UjOY7kIr%2BaMnbo9LOwAyz%2BgTYQrjMTAYz5O/DeGWNLYFkyNOJ9SmSiz/A0zaM9A3cenw9BXdPgatQaKZk2ljCvxXM%2BgDzP2l9iNcblCicdMI5k0hqQPcsAiACrq0IeDgS9l/GJROx5c08GyvZX4Rm94Wk8fkjPDO5bxLRnFeRKrKeqfIoUiuZ%2BCKW1kBRK08LUJmP3lzzNAuuqA%2BEfEdkU0LZ3yF2bymrDuzHBsg8OE7Mpq%2Byk0/soOB7JBHkV1ZLeDhAtz7oaAk5SKGOZTReTxyCcyczxpgjErmyLqOOCeAJWWRm9rGQc0Rl7PzlyFC5EjasBfCvjBAAYHMicE8PqlPcW5UwkWYbQSDOcfu3lJ4d1Nq69Tx68iP6e8Pn42T0KyyNBN8m2G3CEpCE%2BinIRFIzzjhc84irlUuwLYaOIOYgJjAYD8BggPbREkCKBFsDfhcVDhJEXO4csTsLcpYCsAHDNoT5WefgWPP9pWx3Ei8V%2BBawu54cm5fUWaMgFbn8zAFzUzuRzwKRSt2p7xGaMaEB5C85ZgCxWQQGVm2NMIofQ3urHUGm8AoD8J%2BC/DfihNc5eCiuLPN1S/x/4gCD0Uj3ARPxFEB6LJsNlwUQJRQUCGBB%2BgQROM6M08iuiwom5fApuVUkJDDTYKYBgFbTVJCItWhgKSu/ZKseVzA5Sz4Fl0miGTWQWoLb4Zs%2BXEICxj5h8wGVBvsmGwShMtFlNHRTCn0XfIARyYFGSYork0pzFeijKvE2TBYybJKs%2Bxfyl0WWLK4L9QJgvg8Umw05LeLWdt0HDjwv0U8A2YF3tnbwy5moUxd7LrqRFQlhiiihEs9lBKklYct2ZHMDkmzb4Ic7JR3D9kBQA5x8MwfIiKUXUw5aS8pQvlTlJKNZtKBOVwCTm7VGlF1dOXSkzkMz6igtGNF/NT5vT1ZHKFPrMl6VELPFDVKuZbMfEBQy%2BoTSegX1mX/oi6tc7ANEwblnC85%2BNBCJFgWkZUHBo0vYUNy5r7Km4OY8ZRm0u4rThF0HUTF%2BXaKnRxFYI0cttEeVtEfyVIGRcB1A7tsmkVYh5btFg7PLOidXDjl%2BJMwWAqOwE8BUJ3RKWc1ZN4lYhh3OLGdJObMlSeoTQ6oq7xYxRrop2%2BmL8fMuK04mivvHyd6Zc4r5np3AbgoUV5K/FRsUuIdxriMxeAcQBhUQxsJTsYCDyqMD%2BR00pEkEehTJWAUKVYxLYp1yARLSkxVZcVc/ElVOScpS0oRddzXa3QvSdU3mQ1IkXHhNV%2BZK0L8uwHlJJAS7dqa6VDIekjVZ4mUYPOHYk5pJy4l3iBPMqwRP2mYiwJXBTIllX4hy2VfPPRG3xUmp2Tgu%2BO9WqjKZkM7rJ6rhw%2BrUyjcfUa71V5uA2un0ONZIgTUllsFgBdhJwgqUqT0KmayNb6oxRGJkMUaHOAt1OUhTaqJa7NRii26po0lta7FYmAbWqjfUbqf2mkt2pjIVunastRt2fEprK2SKsNWjlDGNr4eLHaxVTKtHR9oeBnZnLLjvZbipEnKl1agK7ErjMB7PcdSJ0%2Bjnok8qojFY2wXVSkcEHABYLQE4AApeAfgDgFoFICoBOAfsGcNmAUD3zVgk4d7LwAICaAb1CwKkCAABTAgWwjwbudsGKJEjEcjqO9RwEkCPqgNr6zgLwHxCQRANz6m9aQDgCwAYAiAFAAz2SB0A4g5ASgGgDkhkb4gwAKQI6hoB%2BUislAaIJwB4CkB%2BVDQckGxt4CcaKQ9q7DS%2Bqo0dIWQDAU8TxtIBYACowANwCePxDcBeAWAMTEYHEA4bJNeAATB2Pk3salo1QHsRJt1BW1UNQVaIJaApAeAsAEm5rCwAk2wheWaQTAD0mU3AAgqRgIDQsH3AW4FAF0LknOBtpPr2N/AQQCIDEDsApAMgQQIoBUDqA1NugJED8WMC3gbAJm/EJAAWCoAKwmQeTWcAuDgQ7gVgSwI8F4CiT7oP0AUPAAWAjVMgLgCGGMFaBBAIY0wAYPECRCpB0gP2OrXoDa2FAGATW%2BEC1tsBW1oytQEYE0E8AtA9AVWroKNr62zAkQspUYONvGCTBGgs2wYFwEq0/qwtt6%2B9ShrU1vqOA%2BwVxAkBOArg1wRwREJICaQQhcAhAEgH%2Bo20Ab3NCwBAEJHMyUAQNEgJOfoE4DIbSANmlxI0kkArhJAbSypACh5yAojMT6l9Qdow0gAsN7mvDYRogBIAlguIFUhRppHUbBZEQF7pwGO2nbVwwAC7VICaS8BDod2hbAZCRBBbhAogcQOFrp1Ra1AqGuLaQDnCWhkgPGnbRwAfWkAYdxWzgCyBVLJAVSB7I7YDqJ3nbjgZOswBCA8A46EQOwR7Sj2e2kBXtvGD7T9qQ28AbNv3IEOBoBRfd/AIHBFAUgKQIoBdqGuHbYAR1q6cNcwT7cDqBAW7iiMG7uRoHKIuJtg/uHXdsD22w70NDurQE7p11mBA9QujgE9sd0LA7NxWEAJICAA%3D))*

## `gles30_state_tables.cpp`

```cpp
//#! cc -std=c++20

// GL ES 3.0.6 (November 1, 2019):
// https://registry.khronos.org/OpenGL/specs/es/3.0/es_spec_3.0.pdf

#include <cstdint>
#include <array>
#include <string>
#include <vector>
```
### // Types
```cpp
using uint = uint32_t; // "Z+"
using ptr = intptr_t; // "Y"
using usize = size_t; // "Z+" with i64 getter.
using ufloat = float; // "R+" (>= 0.0f)
template<uint Possibilities=0, bool OrMore=false> using GLenum = uint32_t;

// (Easier to read array types as N,T instead of T,N)
template<uint N, class T> using arr = std::array<T,N>;
using std::vector;
using std::string;
using bytes = vector<std::byte>;

// -

class Buffer;
class Framebuffer;
class Program;
class Query;
class Renderbuffer;
class Sampler;
class Shader;
class Sync;
class Texture;
class TransformFeedback;
class VertexArray;

template<class T> using id = uint;
```
### // Externs and Constexprs
```cpp
extern int WINDOW_WIDTH;
extern int WINDOW_HEIGHT;
extern GLenum<> BACK;
extern GLenum<> CCW;
extern GLenum<> DONT_CARE;
extern GLenum<> TEXTURE0;
extern GLenum<> ALWAYS;
extern GLenum<> KEEP;
extern GLenum<> LESS;
extern GLenum<> ONE;
extern GLenum<> ZERO;
extern GLenum<> FUNC_ADD;
extern GLenum<> STATIC_DRAW;
extern GLenum<> RGBA4;
extern GLenum<> NEAREST_MIPMAP_LINEAR;
extern GLenum<> LINEAR;
extern GLenum<> REPEAT;
extern GLenum<> LEQUAL;
extern GLenum<> SYNC_FENCE;
extern GLenum<> UNSIGNALED;
extern GLenum<> SYNC_GPU_COMMANDS_COMPLETE;
extern GLenum<> RED;
extern GLenum<> GREEN;
extern GLenum<> BLUE;
extern GLenum<> ALPHA;
extern GLenum<> FLOAT;
extern GLenum<> INTERLEAVED_ATTRIBS;

//extern GLenum<> COLOR_ATTACHMENT0;
//extern GLenum<> NONE;
constexpr GLenum<> COLOR_ATTACHMENT0 = 0x8CE0;
constexpr GLenum<> NONE = 0;

```
### // ImplementationLimits
```cpp
struct ImplementationLimits {
   // p273: Table 6.28: Implementation Dependent Values
   usize MAX_ELEMENT_INDEX = (1 << 24) - 1;
   uint SUBPIXEL_BITS = 4;
   uint MAX_3D_TEXTURE_SIZE = 256;
   uint MAX_TEXTURE_SIZE = 2048;
   uint MAX_ARRAY_TEXTURE_LAYERS = 256;
   ufloat MAX_TEXTURE_LOD_BIAS = 2.0;
   uint MAX_CUBE_MAP_TEXTURE_SIZE = 2048;
   uint MAX_RENDERBUFFER_SIZE = 2048;
   uint MAX_DRAW_BUFFERS = 4;
   uint MAX_COLOR_ATTACHMENTS = 4;
   arr<2, uint> MAX_VIEWPORT_DIMS;
   arr<2, ufloat> ALIASED_POINT_SIZE_RANGE = {1, 1};
   arr<2, ufloat> ALIASED_LINE_WIDTH_RANGE = {1, 1};

   // p274: Table 6.29: Implementation Dependent Values (cont.)
   uint MAX_ELEMENTS_INDICES = 0;
   uint MAX_ELEMENTS_VERTICES = 0;
   vector<GLenum<>> COMPRESSED_TEXTURE_FORMATS;
   vector<GLenum<>> PROGRAM_BINARY_FORMATS;
   vector<GLenum<>> SHADER_BINARY_FORMATS;
   bool SHADER_COMPILER = true;

   struct PerShaderPrecisionFormat {
      arr<2, uint> range;
      uint precision;
   };
   arr<2*2*3, PerShaderPrecisionFormat> shaderPrecisionFormats;

   usize MAX_SERVER_WAIT_TIMEOUT = 0;

   // p275: Table 6.30: Implementation Dependent Version and Extension Support
   vector<string> EXTENSIONS;
   uint MAJOR_VERSION = 3;
   uint MINOR_VERSION = 0;
   string RENDERER;
   string SHADER_LANGUAGE_VERSION;
   string VENDOR;
   string VERSION;

   // p276: Table 6.31: Implementation Dependent Vertex Shader Limits
   uint MAX_VERTEX_ATTRIBS = 16;
   uint MAX_VERTEX_UNIFORM_COMPONENTS = 1024;
   uint MAX_VERTEX_UNIFORM_VECTORS = 256;
   uint MAX_VERTEX_UNIFORM_BLOCKS = 12;
   uint MAX_VERTEX_OUTPUT_COMPONENTS = 64;
   uint MAX_VERTEX_TEXTURE_IMAGE_UNITS = 16;

   // p277: Table 6.32: Implementation Dependent Fragment Shader Limits
   uint MAX_FRAGMENT_UNIFORM_COMPONENTS = 896;
   uint MAX_FRAGMENT_UNIFORM_VECTORS = 224;
   uint MAX_FRAGMENT_UNIFORM_BLOCKS = 12;
   uint MAX_FRAGMENT_INPUT_COMPONENTS = 60;
   uint MAX_TEXTURE_IMAGE_UNITS = 16;
   int MIN_PROGRAM_TEXEL_OFFSET = -8;
   int MAX_PROGRAM_TEXEL_OFFSET = 7;

   // p278: Table 6.33: Implementation Dependent Aggregate Shader Limits
   uint MAX_UNIFORM_BUFFER_BINDINGS = 24;
   usize MAX_UNIFORM_BLOCK_SIZE = 16384;
   uint UNIFORM_BUFFER_OFFSET_ALIGNMENT = 256;
   uint MAX_COMBINED_UNIFORM_BLOCKS = 24;
   constexpr usize MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS() const {
      return MAX_VERTEX_UNIFORM_BLOCKS * MAX_UNIFORM_BLOCK_SIZE / 4
        + MAX_VERTEX_UNIFORM_COMPONENTS;
   }
   constexpr usize MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS() const {
      return MAX_FRAGMENT_UNIFORM_BLOCKS * MAX_UNIFORM_BLOCK_SIZE / 4
      + MAX_FRAGMENT_UNIFORM_COMPONENTS;
   }
   uint MAX_VARYING_COMPONENTS = 60;
   uint MAX_VARYING_VECTORS = 15;
   uint MAX_COMBINED_TEXTURE_IMAGE_UNITS = 32;

   // p279: Table 6.34: Implementation Dependent Transform Feedback Limits:
   uint MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS = 64;
   uint MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS = 4;
   uint MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS = 4;

   // p281: Table 6.36: Miscellaneous
   arr<3, id<Query>> CURRENT_QUERY = {0};
   id<Buffer> COPY_READ_BUFFER_BINDING = 0;
   id<Buffer> COPY_WRITE_BUFFER_BINDING = 0;

   // Implied:
   usize _MAX_STENCIL_BITS = 8;
};
static constexpr auto LIMITS = ImplementationLimits{};

```
### // ContextState
```cpp
struct ContextState {
   // p248: Table 6.3: Vertex Array Data (not in vertex array objects)
   id<Buffer> ARRAY_BUFFER_BINDING = 0;
   id<VertexArray> VERTEX_ARRAY_BINDING;
   bool PRIMITIVE_RESTART_FIXED_INDEX = false;

   // p250: Table 6.5: Transformation State
   arr<4, int> VIEWPORT = {0, 0, WINDOW_WIDTH, WINDOW_HEIGHT};
   arr<2, ufloat> DEPTH_RANGE = {0, 1};
   id<TransformFeedback> TRANSFORM_FEEDBACK_BINDING = 0;

   // p251: Table 6.6: Rasterization
   bool RASTERIZER_DISCARD = false;
   ufloat LINE_WIDTH = 1.0;
   bool CULL_FACE = false;
   GLenum<3> CULL_FACE_MODE = BACK;
   GLenum<2> FRONT_FACE = CCW;
   float POLYGON_OFFSET_FACTOR = 0;
   float POLYGON_OFFSET_UNITS = 0;
   bool POLYGON_OFFSET_FILL = false;

   // p252: Table 6.7: Multisampling
   bool SAMPLE_ALPHA_TO_COVERAGE = false;
   bool SAMPLE_COVERAGE = false;
   ufloat SAMPLE_COVERAGE_VALUE = 1.0f;
   bool SAMPLE_COVERAGE_INVERT = false;

   // p253: Table 6.8: Textures (selector, state per texture unit)
   GLenum<32,true> ACTIVE_TEXTURE = TEXTURE0;
   arr<LIMITS.MAX_COMBINED_TEXTURE_IMAGE_UNITS, id<Texture>> TEXTURE_BINDING_2D = {0};
   arr<LIMITS.MAX_COMBINED_TEXTURE_IMAGE_UNITS, id<Texture>> TEXTURE_BINDING_3D = {0};
   arr<LIMITS.MAX_COMBINED_TEXTURE_IMAGE_UNITS, id<Texture>> TEXTURE_BINDING_2D_ARRAY = {0};
   arr<LIMITS.MAX_COMBINED_TEXTURE_IMAGE_UNITS, id<Texture>> TEXTURE_BINDING_CUBE_MAP = {0};
   arr<LIMITS.MAX_COMBINED_TEXTURE_IMAGE_UNITS, id<Sampler>> SAMPLER_BINDING = {0};

   // p256: Table 6.11: Pixel Operations
   bool SCISSOR_TEST = false;
   arr<4, int> SCISSOR_BOX = {0, 0, WINDOW_WIDTH, WINDOW_HEIGHT};
   bool STENCIL_TEST = false;
   GLenum<8> STENCIL_FUNC = ALWAYS;
   uint STENCIL_VALUE_MASK = (1 << LIMITS._MAX_STENCIL_BITS)-1;
   uint STENCIL_REF = 0;
   GLenum<8> STENCIL_FAIL = KEEP;
   GLenum<8> STENCIL_PASS_DEPTH_FAIL = KEEP;
   GLenum<8> STENCIL_PASS_DEPTH_PASS = KEEP;
   GLenum<8> STENCIL_BACK_FUNC = ALWAYS;
   uint STENCIL_BACK_VALUE_MASK = (1 << LIMITS._MAX_STENCIL_BITS)-1;
   uint STENCIL_BACK_REF = 0;
   GLenum<8> STENCIL_BACK_FAIL = KEEP;
   GLenum<8> STENCIL_BACK_FAIL_PASS_DEPTH_FAIL = KEEP;
   GLenum<8> STENCIL_BACK_FAIL_PASS_DEPTH_PASS = KEEP;
   bool DEPTH_TEST = false;
   GLenum<8> DEPTH_FUNC = LESS;
   bool BLEND = false;
   GLenum<19> BLEND_SRC_RGB = ONE;
   GLenum<19> BLEND_SRC_ALPHA = ONE;
   GLenum<19> BLEND_DST_RGB = ZERO;
   GLenum<19> BLEND_DST_ALPHA = ZERO;
   GLenum<5> BLEND_EQUATION_RGB = FUNC_ADD;
   GLenum<5> BLEND_EQUATION_ALPHA = FUNC_ADD;
   arr<4, float> BLEND_COLOR = {0,0,0,0};
   bool DITHER = true;

   // p257: Table 6.12: Framebuffer Control
   arr<4, bool> COLOR_WRITEMASK = {true, true, true, true};
   bool DPETH_WRITEMASK = true;
   uint STENCIL_WRITEMASK = ~0;
   uint STENCIL_BACK_WRITEMASK = ~0;
   arr<4, float> COLOR_CLEAR_VALUE = {0,0,0,0};
   ufloat DEPTH_CLEAR_VALUE = 1.0;
   uint STENCIL_CLEAR_VALUE = 0;
   id<Framebuffer> DRAW_FRAMEBUFFER_BINDING = 0;
   id<Framebuffer> READ_FRAMEBUFFER_BINDING = 0;
   id<Renderbuffer> RENDERBUFFER_BINDING = 0;

   // p261: Table 6.16: Pixels
   uint UNPACK_IMAGE_HEIGHT = 0;
   uint UNPACK_SKIP_IMAGES = 0;
   uint UNPACK_ROW_LENGTH = 0;
   uint UNPACK_SKIP_ROWS = 0;
   uint UNPACK_SKIP_PIXELS = 0;
   uint UNPACK_ALIGNMENT = 0;
   uint PACK_ROW_LENGTH = 0;
   uint PACK_SKIP_ROWS = 0;
   uint PACK_SKIP_PIXELS = 0;
   uint PACK_ALIGNMENT = 0;
   id<Buffer> PIXEL_PACK_BUFFER_BINDING = 0;
   id<Buffer> PIXEL_UNPACK_BUFFER_BINDING = 0;

   // p263: Table 6.18: Program Object State
   id<Program> CURRENT_PROGRAM = 0;

   // p267: Table 6.22: Vertex Shader State (not part of program objects)
   arr<LIMITS.MAX_VERTEX_ATTRIBS, arr<4, float>> CURRENT_VERTEX_ATTRIB = {{0,0,0,1}};

   // p269: Table 6.24: Transform Feedback State
   id<Buffer> TRANSFORM_FEEDBACK_BUFFER_BINDING = 0;

   // p270: Table 6.25: Uniform Buffer Binding State
   id<Buffer> UNIFORM_BUFFER_BINDING = 0;

   struct PerUniformBuffer {
      id<Buffer> UNIFORM_BUFFER_BINDING = 0;
      usize UNIFORM_BUFFER_START = 0;
      usize UNIFORM_BUFFER_SIZE = 0;
   };
   arr<LIMITS.MAX_UNIFORM_BUFFER_BINDINGS, PerUniformBuffer> uniformBuffers;

   // p272: Table 6.27: Hints
   GLenum<3> GENERATE_MIPMAP_HINT = DONT_CARE;
   GLenum<3> FRAGMENT_SHADER_DERIVATIVE_HINT = DONT_CARE;
};
```
### // BufferState
```cpp
struct BufferState {
   // p249: Table 6.4: Buffer Object State
   usize BUFFER_SIZE = 0;
   GLenum<9> BUFFER_USAGE = STATIC_DRAW;
   uint BUFFER_ACCESS_FLAGS = 0;
   bool BUFFER_MAPPED = false;
   ptr BUFFER_MAP_POINTER = 0;
   usize BUFFER_MAP_OFFSET = 0;
   usize BUFFER_MAP_LENGTH = 0;
};
```
### // FramebufferState
```cpp
struct FramebufferState {
   // p258: Table 6.13: Framebuffer (state per framebuffer object)
   arr<LIMITS.MAX_DRAW_BUFFERS, GLenum<11,true>> DRAW_BUFFERi = {COLOR_ATTACHMENT0, 0 };
   GLenum<11,true> READ_BUFFER; // Queried from READ_FRAMEBUFFER

   // p259: Table 6.14: Framebuffer (state per attachment point)
   struct PerAttachment {
      GLenum<4> FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = NONE;
      union {
        id<Renderbuffer> rb = 0;
        id<Texture> tex;
      } FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = {};
      uint FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 0;
      uint FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = NONE;
      int FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER = 0; // Errata: uint?
      GLenum<2> FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING;
      GLenum<4> FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE;
      uint FRAMEBUFFER_ATTACHMENT_RED_SIZE;
      uint FRAMEBUFFER_ATTACHMENT_GREEN_SIZE;
      uint FRAMEBUFFER_ATTACHMENT_BLUE_SIZE;
      uint FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE;
      uint FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE;
      uint FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE;
   };
   arr<LIMITS.MAX_COLOR_ATTACHMENTS, PerAttachment> attachments;

   // p280: Table 6.35: Framebuffer Dependent Values
   uint SAMPLE_BUFFERS = 0;
   uint SAMPLES = 0;
   uint MAX_SAMPLES = 4;
   uint RED_BITS;
   uint GREEN_BITS;
   uint BLUE_BITS;
   uint ALPHA_BITS;
   uint DEPTH_BITS;
   uint STENCIL_BITS;
   GLenum<> IMPLEMENTATION_COLOR_READ_TYPE; // Queried from READ_FRAMEBUFFER.
   GLenum<> IMPLEMENTATION_COLOR_READ_FORMAT; // Queried from READ_FRAMEBUFFER.
};

static_assert(FramebufferState{}.DRAW_BUFFERi[0] == COLOR_ATTACHMENT0);
static_assert(FramebufferState{}.DRAW_BUFFERi[1] == 0);
static_assert(FramebufferState{}.DRAW_BUFFERi[2] == 0);

```
### // ProgramState
```cpp
struct ProgramState {
   // p263: Table 6.18: Program Object State
   bool DELETE_STATUS = false;
   bool LINK_STATUS = false;
   bool VALIDATE_STATUS = false;
   vector<id<Shader>> ATTACHED_SHADERS = {};
   string INFO_LOG = "";

   struct PerActiveUniform {
      int location;
      uint size;
      GLenum<> type;
      string name;
      // p265: Table 6.20: Program Object State (cont.)
      GLenum<27> UNIFORM_TYPE;
      uint UNIFORM_SIZE;
      int UNIFORM_BLOCK_INDEX;
      int UNIFORM_OFFSET;
      // p266: Table 6.21: Program Object State (cont.)
      int UNIFORM_ARRAY_STRIDE;
      int UNIFORM_MATRIX_STRIDE;
      bool UNIFORM_IS_ROW_MAJOR;
   };
   vector<PerActiveUniform> ACTIVE_UNIFORMS = {};
   //vector<PerActiveAttribute> ACTIVE_ATTRIBUTES = {}; // Moved below.
   bool PROGRAM_BINARY_RETRIEVABLE_HINT = false;
   bytes PROGRAM_BINARY = {};

   // p264: Table 6.19: Program Object State (cont.)
   struct PerActiveAttribute {
      int location;
      uint size;
      GLenum<> type;
      string name;
   };
   vector<PerActiveAttribute> ACTIVE_ATTRIBUTES = {}; // Actually p263.

   GLenum<2> TRANSFORM_FEEDBACK_BUFFER_MODE = INTERLEAVED_ATTRIBS;
   struct PerActiveTfVarying {
      uint size;
      GLenum<> type;
      string name;
   };
   vector<PerActiveTfVarying> TRANSFORM_FEEDBACK_VARYINGS = {};

   // p265: Table 6.20: Program Object State (cont.)
   //vector<PerActiveUniformBlock> ACTIVE_UNIFORM_BLOCKS = {}; // Moved below.
   struct PerActiveUniformBlock {
      // p266: Table 6.21: Program Object State (cont.)
      uint UNIFORM_BLOCK_BINDING = 0;
      uint UNIFORM_BLOCK_DATA_SIZE;
      vector<uint> UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES;
      bool UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER = false;
      bool UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = false;
   };
   vector<PerActiveUniformBlock> ACTIVE_UNIFORM_BLOCKS = {}; // Actually p265.
};
```
### // QueryState
```cpp
struct QueryState {
   // p268: Table 6.23: Query Object State
   uint QUERY_RESULT = 0;
   bool QUERY_RESULT_AVAILABLE = false;
};
```
### // RenderbufferState
```cpp
struct RenderbufferState {
   // p260: Table 6.15: Renderbuffer (state per renderbuffer object)
   uint RENDERBUFFER_WIDTH = 0;
   uint RENDERBUFFER_HEIGHT = 0;
   GLenum<43> RENDERBUFFER_INTERNAL_FORMAT = RGBA4;
   uint RENDERBUFFER_RED_SIZE = 0;
   uint RENDERBUFFER_GREEN_SIZE = 0;
   uint RENDERBUFFER_BLUE_SIZE = 0;
   uint RENDERBUFFER_ALPHA_SIZE = 0;
   uint RENDERBUFFER_DEPTH_SIZE = 0;
   uint RENDERBUFFER_STENCIL_SIZE = 0;
   uint RENDERBUFFER_SAMPLES = 0;
};
```
### // SamplerState
```cpp
struct SamplerState {
   // p255: Table 6.10: Textures (state per sampler object)
   GLenum<6> TEXTURE_MIN_FILTER = NEAREST_MIPMAP_LINEAR;
   GLenum<6> TEXTURE_MAG_FILTER = LINEAR;
   GLenum<4> TEXTURE_WRAP_S = REPEAT;
   GLenum<4> TEXTURE_WRAP_T = REPEAT;
   GLenum<4> TEXTURE_WRAP_R = REPEAT;

   float TEXTURE_MIN_LOD = -1000;
   float TEXTURE_MAX_LOD = 1000;
   GLenum<2> TEXTURE_COMPARE_MODE = NONE;
   GLenum<8> TEXTURE_COMPARE_FUNC = LEQUAL;
};
```
### // ShaderState
```cpp
struct ShaderState {
   // p262: Table 6.17: Shader Object State
   GLenum<3> SHADER_TYPE;
   bool DELETE_STATUS = false;
   bool COMPILE_STATUS = false;
   string ShaderInfoLog = "";
   uint INFO_LOG_LENGTH = 0;
   string ShaderSource = "";
   uint SHADER_SOURCE_LENGTH = 0;
};
```
### // SyncState
```cpp
struct SyncState {
   // p271: Table 6.26: Sync (state per sync object)
   GLenum<1> OBJECT_TYPE = SYNC_FENCE;
   GLenum<2> SYNC_STATUS = UNSIGNALED;
   GLenum<1> SYNC_CONDITION = SYNC_GPU_COMMANDS_COMPLETE;
   uint SYNC_FLAGS = 0;
};
```
### // TextureState
```cpp
struct TextureState {
   // p254: Table 6.9: Textures (state per texture object)
   GLenum<6> TEXTURE_SWIZZLE_R = RED;
   GLenum<6> TEXTURE_SWIZZLE_G = GREEN;
   GLenum<6> TEXTURE_SWIZZLE_B = BLUE;
   GLenum<6> TEXTURE_SWIZZLE_A = ALPHA;

   GLenum<6> TEXTURE_MIN_FILTER = NEAREST_MIPMAP_LINEAR;
   GLenum<6> TEXTURE_MAG_FILTER = LINEAR;
   GLenum<4> TEXTURE_WRAP_S = REPEAT;
   GLenum<4> TEXTURE_WRAP_T = REPEAT;
   GLenum<4> TEXTURE_WRAP_R = REPEAT;

   float TEXTURE_MIN_LOD = -1000;
   float TEXTURE_MAX_LOD = 1000;
   uint TEXTURE_BASE_LEVEL = 0;
   uint TEXTURE_MAX_LEVEL = 1000;
   GLenum<2> TEXTURE_COMPARE_MODE = NONE;
   GLenum<8> TEXTURE_COMPARE_FUNC = LEQUAL;
   bool TEXTURE_IMMUTABLE_FORMAT = false;
   uint TEXTURE_IMMUTABLE_LEVELS = 0;
};
```
### // TransformFeedbackState
```cpp
struct TransformFeedbackState {
   // p269: Table 6.24: Transform Feedback State
   struct PerBinding {
      id<Buffer> TRANSFORM_FEEDBACK_BUFFER_BINDING = 0;
      usize TRANSFORM_FEEDBACK_BUFFER_START = 0;
      usize TRANSFORM_FEEDBACK_BUFFER_SIZE = 0;
   };
   arr<LIMITS.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS, PerBinding> bindings = {};

   bool TRANSFORM_FEEDBACK_PAUSED = false;
   bool TRANSFORM_FEEDBACK_ACTIVE = false;
};
```
### // VertexArrayState
```cpp
struct VertexArrayState {
   // p247: Table 6.2: Vertex Array Object State
   struct PerAttrib {
      bool VERTEX_ATTRIB_ARRAY_ENABLED = false;
      GLenum<5> VERTEX_ATTRIB_ARRAY_SIZE = 4;
      uint VERTEX_ATTRIB_ARRAY_STRIDE = 0;
      GLenum<9> VERTEX_ATTRIB_ARRAY_TYPE = FLOAT;
      bool VERTEX_ATTRIB_ARRAY_NORMALIZED = false;
      bool VERTEX_ATTRIB_ARRAY_INTEGER = false;
      uint VERTEX_ATTRIB_ARRAY_DIVISOR = 0;
      ptr VERTEX_ATTRIB_ARRAY_POINTER = 0;
      id<Buffer> VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 0;
   };
   arr<LIMITS.MAX_VERTEX_ATTRIBS, PerAttrib> attribs;

   id<Buffer> ELEMENT_ARRAY_BUFFER_BINDING = 0;
};
```
