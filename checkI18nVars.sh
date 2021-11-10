#!/bin/sh

# collect placeholder defined in i18n files, and search them in code.
#

beep=on
verbose=off

grep -E '\"(.*)?\": \"' src/assets/i18n/*.json  | cut -d '"' -f 2 | sort -u | while IFS= read -r ph
do
    pattern="\{\{.*\."$ph
    
    c=$(grep -r -E "$pattern" src/app | wc -l)

    if [ "$verbose" = on ]; then  
        printf "\n Word -> %s found %s in code \n" "$ph"  "$c"
    fi

    if [ "$c" -eq 0 ]; then
        printf "\nPlaceholder --%s-- not found in code \n"  "$ph"
        if [ "$beep" = on ]; then  printf "\a"; fi
    else
        if [ "$verbose" = on ]; then  printf "\nPlaceholder --%s-- found in %s files in code \n" "$ph" "${c}"; fi
    fi

    for f in src/assets/i18n/*.json; do
        printf "-"
        if n=$(grep -wic "$ph" "$f"); then
            if [ "$verbose" = on ]; then  printf "\b\nfound %s in %s \n-" "${n}" "$f"; fi
            if [ "$c" -eq 0 ]; then
                printf "\b\n -- %s-- not found in code but found in %s \n-" "$ph" "$f"
                if [ "$beep" = on ]; then  printf "\a"; fi
            fi
        else
            if [ "$c" -ne 0 ]; then
                  if [ "$beep" = on ]; then  printf "\a"; fi
                printf "\b\n -- %s-- not found %s in %s \n-" "%ph" "${n}" "$f"
            fi
        fi
        printf "\b"
    done   
done