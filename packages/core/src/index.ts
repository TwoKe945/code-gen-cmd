#! /usr/bin/env node
import { withOptions } from '@code-gen-bin/commands'
import { program } from 'commander'
import { version } from '../package.json'
const [ execute ] = withOptions(program)
execute({ packageVersion: version })
