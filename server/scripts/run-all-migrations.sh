#!/usr/bin/env sh
set -ex

alias runsql="psql toc_tracker <"

runsql ./migrations/010--create-tables-book-and-chapter.sql
runsql ./migrations/020--create-table-user.sql
