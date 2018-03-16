#!/usr/bin/env sh
# This software is released under the CC0 Public Domain License.
# WARNING: This script will delete all of your resource packs, servers, settings, game files, logs, mods and screenshots.
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

create_constants() {
    # Directories that will not be deleted
    skipdir=("saves")

    # Directory to store the backup in, relative to the data directory
    backdir="../minecraft.old"

    # Cache command output for better performance
    uname="$(uname)"
    whoami="$(whoami)"
}

create_backup() {
    backtrg="$backdir/$(date +%s)/"
    mkdir -p "$backtrg"
    echo "Creating a backup of your data directory"
    cp -R "$mcd" "$backtrg"
}

create_fifo() {
    dfifo="$(mktemp -u)"
    trap "rm -f $dfifo" EXIT
    mkfifo "$dfifo"
}

delete_backup() {
    echo "Deleting backup"
    rm -rf "$backtrg"
}

detect_data_directory() {
    echo "Attempting to automatically detect your Minecraft data directory"
    unset mcd
    [[ "$uname" = *"Linux"* ]] && mcd="$HOME/.minecraft"
    [[ "$uname" = *"Darwin"* ]] && mcd="$HOME/Library/Application Support/minecraft"

    while [ -z "$mcd" ] || [ ! -d "$mcd" ] ; do
        read -ep "Detection failed. Please enter the path to your Minecraft directory: " mcd

        if [[ "$(basename "$mcd")" != *"minecraft" ]] && [ ! -d "$mcd/saves" ]; then
            echo "Sorry, either that's an invalid Minecraft directory or you haven't yet started the game."
            unset mcd
        fi
    done

    echo "Detected: $mcd"
    backdir="$mcd/$backdir"

    if type realpath &> /dev/null; then
        backdir="$(realpath "$backdir")"
    fi
}

reinstall_game() {
    deleted=0
    delfail=0

    find "$mcd" -mindepth 1 -maxdepth 1 | while read p; do
        echo "$p" > "$dfifo"
    done &

    while read p; do
        bn="$(basename "$p")"
        for s in "${skipdir[@]}"; do
            [ "$bn" = "$s" ] && continue 2
        done

        chown -f "$whoami" "$p"
        chmod -f 755 "$p"
        rm -fr "$p"

        if [ $? -eq 0 ]; then
            let deleted++
            echo "Deleted: $bn"
        else
            let delfail++
            echo "Failed to delete: $bn"
        fi
    done < "$dfifo"
}

show_statistics() {
    if [ "$deleted" -eq 0 ]; then
        echo "Already uninstalled, please try starting the game"
        delete_backup
    else
        if [ "$deleted" -eq 1 ]; then
            echo "Successfully deleted one file or directory"
        else
            echo "Successfully deleted $deleted objects"
        fi

        echo "A backup of your game directory has been created in $backtrg"
        echo "Please try playing now. Good luck!"
    fi

    if [ "$delfail" -ge 1 ]; then
        if [ "$delfail" -eq 1 ]; then
            echo "Failed to delete one file or directory (make sure your game isn't running and try again)"
        else
            echo "Failed to delete $delfail objects (make sure your game isn't running and try again)"
        fi
    fi
}

create_constants
create_fifo
detect_data_directory
create_backup
reinstall_game
show_statistics